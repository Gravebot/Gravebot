import Promise from 'bluebird';
import cheerio from 'cheerio';
import R from 'ramda';
import _request from 'request';

import sentry from './config/sentry';
import { getOrdinal, numberWithCommas, toTitleCase } from './helpers';

const request = Promise.promisify(_request);

const help_text = `Dota 2 help commands

**\`!dota2 counters\`** \`hero-name\`
    Get the top 10 counters for a Hero`;


function counters(bot, msg, suffix) {
  let hero = suffix.toLowerCase().replace('counters ', '').replace('counter ', '');
  let options = {
    url: `http://www.dotabuff.com/heroes/${hero.replace(/ /g, '-')}/matchups`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  };

  request(options)
    .tap(res => {
      if (res.statusCode === 404) throw new Error(`Hero **${hero}** not found`);
      if (res.statusCode >= 500) throw new Error(`Sorry, I'm not able to retrieve information at the moment.`);
    })
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => {
      return $('table[class="sortable"]').find('tr').map((i, el) => {
        let td = $(el).find('td');
        let name = td.eq(0).attr('data-value');

        if (!name) return null;
        return {
          name: name,
          advantage: parseFloat(td.eq(2).attr('data-value')),
          winrate: parseFloat(td.eq(3).attr('data-value')),
          matches: Number(td.eq(4).attr('data-value'))
        };
      }).get();
    })
    .then(R.reject(R.isNil))
    .then(R.slice(0, 10))
    .then(data => {
      return R.addIndex(R.map)((hero, idx) => `*${getOrdinal(idx + 1)}*. **${hero.name}** - ${100 - hero.winrate}% win rate over ${numberWithCommas(hero.matches)} matches.`, data);
    })
    .then(R.prepend(`Sure! Here's the top 10 **statistical** counters for **${toTitleCase(hero)}** this month:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  dota2: (bot, msg, suffix) => {
    let command = suffix.toLowerCase().split(' ')[0];

    if (command === 'counters') return counters(bot, msg, suffix);
    if (command === 'counter') return counters(bot, msg, suffix);
    return bot.sendMessage(msg.channel, help_text);
  }
};
