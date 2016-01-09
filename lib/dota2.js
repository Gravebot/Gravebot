import Promise from 'bluebird';
import cheerio from 'cheerio';
import R from 'ramda';
import _request from 'request';

import sentry from './config/sentry';
import { getOrdinal, numberWithCommas, secondDec, toTitleCase } from './helpers';

const request = Promise.promisify(_request);

const help_text = `Dota 2 help commands
Accepted positions are **Mid**, **Off**, **Safe**, or **Jungle**.

**\`!dota2 best\`** \`position\`
    Get the top 10 Heros for a specific position
**\`!dota2 build\`** \`hero-name\`
    Get the most popular build for a Hero
**\`!dota2 counters\`** \`hero-name\`
    Get the top 10 counters for a Hero
**\`!dota2 impact\`**
    Get the top 10 Heros with the biggest impact
**\`!dota2 items\`** \`hero-name\`
    Get the top 10 most used items for a Hero`;

const positions = {
  middle: 'mid',
  mid: 'mid',
  off: 'off',
  offlane: 'off',
  'off lane': 'off',
  safe: 'safe',
  safelane: 'safe',
  'safe lane': 'safe',
  jungle: 'jungle',
  jg: 'jungle'
};


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
      return R.addIndex(R.map)((hero, idx) => `*${getOrdinal(idx + 1)}*. **${hero.name}** - ${secondDec(100 - hero.winrate)}% win rate over ${numberWithCommas(hero.matches)} matches.`, data);
    })
    .then(R.prepend(`Sure! Here's the top 10 **statistical** counters for **${toTitleCase(hero)}** this month:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function best(bot, msg, suffix) {
  let position = suffix.replace('best', '').toLowerCase().trim();
  let db_position = positions[position];
  if (!db_position) return bot.sendMessage(msg.channel, `I don't understand position **${position}**. Did you mean mid, off, safe, or jungle?`);

  let options = {
    url: `http://www.dotabuff.com/heroes/lanes?lane=${db_position}`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  };

  request(options)
    .tap(res => {
      if (res.statusCode >= 400) throw new Error(`Sorry, I'm not able to retrieve information at the moment.`);
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
          presence: parseFloat(td.eq(2).attr('data-value')),
          winrate: parseFloat(td.eq(3).attr('data-value')),
          kda: Number(td.eq(4).attr('data-value')),
          gpm: Number(td.eq(5).attr('data-value')),
          xpm: Number(td.eq(6).attr('data-value'))
        };
      }).get();
    })
    .then(R.reject(R.isNil))
    .then(R.slice(0, 10))
    .then(data => {
      return R.addIndex(R.map)((hero, idx) => `*${getOrdinal(idx + 1)}*. **${hero.name}**
    Presence: __${secondDec(hero.presence)}%__ | Winrate: __${secondDec(hero.winrate)}%__ | KDA: __${hero.kda}__ | GPM: __${hero.gpm}__ | XPM: __${hero.xpm}__`, data);
    })
    .then(R.prepend(`Okay! Here's the top 10 **statistical** heros for **${position}**:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function impact(bot, msg, suffix) {
  let options = {
    url: `http://www.dotabuff.com/heroes/impact`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  };

  request(options)
    .tap(res => {
      if (res.statusCode >= 400) throw new Error(`Sorry, I'm not able to retrieve information at the moment.`);
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
          kda: parseFloat(td.eq(2).attr('data-value')),
          kills: parseFloat(td.eq(3).attr('data-value')),
          deaths: Number(td.eq(4).attr('data-value')),
          assists: Number(td.eq(5).attr('data-value'))
        };
      }).get();
    })
    .then(R.reject(R.isNil))
    .then(R.slice(0, 10))
    .then(data => {
      return R.addIndex(R.map)((hero, idx) => `*${getOrdinal(idx + 1)}*. **${hero.name}**
    KDA: __${hero.kda}__ | Kills: __${hero.kills}__ | Deaths: __${hero.deaths}__ | Assists: __${hero.assists}__`, data);
    })
    .then(R.prepend(`Alright! Here's the top 10 heros with the biggest impact this month:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function items(bot, msg, suffix) {
  let hero = suffix.toLowerCase().replace('items ', '').replace('item ', '');
  let options = {
    url: `http://www.dotabuff.com/heroes/${hero.replace(/ /g, '-')}/items`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  };

  request(options)
    .tap(res => {
      if (res.statusCode >= 400) throw new Error(`Sorry, I'm not able to retrieve information at the moment.`);
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
          matches: parseFloat(td.eq(2).attr('data-value')),
          winrate: parseFloat(td.eq(3).attr('data-value'))
        };
      }).get();
    })
    .then(R.reject(R.isNil))
    .then(R.slice(0, 10))
    .then(data => {
      return R.addIndex(R.map)((item, idx) => `*${getOrdinal(idx + 1)}*. **${item.name}** with ${secondDec(item.winrate)}% winrate over ${numberWithCommas(item.matches)} matches`, data);
    })
    .then(R.prepend(`Alright! Here's the top 10 **most used** items for **${hero}** this month:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function build(bot, msg, suffix) {
  let hero = suffix.toLowerCase().replace('builds ', '').replace('build ', '');
  let options = {
    url: `http://www.dotabuff.com/heroes/${hero.replace(/ /g, '-')}/builds`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  };

  request(options)
    .tap(res => {
      if (res.statusCode >= 400) throw new Error(`Sorry, I'm not able to retrieve information at the moment.`);
    })
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => {
      let priorities = $('div[class="abilities"]').first().find('.hotkey').map((i, el) => {
        return $(el).text();
      }).get().join(' > ');

      let text = `You got it! Here's most popular build priorities for **${hero}**.\n${priorities}`;
      bot.sendMessage(msg.channel, text);
    })
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  dota2: (bot, msg, suffix) => {
    let command = suffix.toLowerCase().split(' ')[0];

    if (command === 'build') return build(bot, msg, suffix);
    if (command === 'builds') return build(bot, msg, suffix);
    if (command === 'best') return best(bot, msg, suffix);
    if (command === 'counters') return counters(bot, msg, suffix);
    if (command === 'counter') return counters(bot, msg, suffix);
    if (command === 'impact') return impact(bot, msg);
    if (command === 'item') return items(bot, msg, suffix);
    if (command === 'items') return items(bot, msg, suffix);
    if (command === 'skill') return build(bot, msg, suffix);
    if (command === 'skills') return build(bot, msg, suffix);
    return bot.sendMessage(msg.channel, help_text);
  }
};
