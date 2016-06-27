import Promise from 'bluebird';
import cheerio from 'cheerio';
import R from 'ramda';
import _request from 'request';
import SuperError from 'super-error';

import { subCommands as helpText } from '../help';
import { getOrdinal, numberWithCommas, secondDec, toTitleCase } from '../../helpers';


const Warning = SuperError.subclass('Warning', function(msg) {
  this.message = msg || 'Not Found';
  this.code = 404;
  this.level = 'warning';
});


const request = Promise.promisify(_request);
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

function best(suffix) {
  const position = suffix.replace('best', '').toLowerCase().trim();
  const db_position = positions[position];
  if (!db_position) return Promise.resolve(`I don't understand position **${position}**. Did you mean **mid**, **off**, **safe**, or **jungle**?`);

  const options = {
    url: `http://www.dotabuff.com/heroes/lanes?lane=${db_position}`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  };

  return request(options)
    .tap(res => {
      if (res.statusCode >= 400) throw new Error(`Sorry, I'm not able to retrieve information at the moment.`);
    })
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => {
      return $('table[class="sortable"]').find('tr').map((i, el) => {
        const td = $(el).find('td');
        const name = td.eq(0).attr('data-value');

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
    .then(R.prepend(`Okay! Here's the top 10 **statistical** Heroes for **${position}**:\n`))
    .then(R.join('\n'));
}

function build(suffix) {
  const hero = suffix.toLowerCase().split(' ').slice(1, 10).join(' ');
  const options = {
    url: `http://www.dotabuff.com/heroes/${hero.replace(/ /g, '-')}/builds`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  };

  return request(options)
    .tap(res => {
      if (res.statusCode >= 400) throw new Error(`Sorry, I'm not able to retrieve information at the moment.`);
    })
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => {
      const priorities = $('div[class="abilities"]').first().find('.hotkey').map((i, el) => {
        return $(el).text();
      }).get().join(' > ');

      return `You got it! Here's most popular build priorities for **${toTitleCase(hero)}**.\n${priorities}`;
    });
}

function counters(suffix) {
  const hero = suffix.toLowerCase().split(' ').slice(1, 10).join(' ');
  const options = {
    url: `http://www.dotabuff.com/heroes/${hero.replace(/ /g, '-')}/matchups`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  };

  return request(options)
    .tap(res => {
      if (res.statusCode === 404) throw new Warning(`Hero **${hero}** not found`);
      if (res.statusCode >= 500) throw new Error(`Sorry, I'm not able to retrieve information at the moment.`);
    })
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => {
      return $('table[class="sortable"]').find('tr').map((i, el) => {
        const td = $(el).find('td');
        const name = td.eq(0).attr('data-value');

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
    .then(R.join('\n'));
}

function impact() {
  const options = {
    url: `http://www.dotabuff.com/heroes/impact`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  };

  return request(options)
    .tap(res => {
      if (res.statusCode >= 400) throw new Error(`Sorry, I'm not able to retrieve information at the moment.`);
    })
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => {
      return $('table[class="sortable"]').find('tr').map((i, el) => {
        const td = $(el).find('td');
        const name = td.eq(0).attr('data-value');

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
    .then(R.prepend(`Alright! Here's the top 10 Heroes with the biggest impact this month:\n`))
    .then(R.join('\n'));
}

function items(suffix) {
  const hero = suffix.toLowerCase().split(' ').slice(1, 10).join(' ');
  const options = {
    url: `http://www.dotabuff.com/heroes/${hero.replace(/ /g, '-')}/items`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
    }
  };

  return request(options)
    .tap(res => {
      if (res.statusCode >= 400) throw new Error(`Sorry, I'm not able to retrieve information at the moment.`);
    })
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => {
      return $('table[class="sortable"]').find('tr').map((i, el) => {
        const td = $(el).find('td');
        const name = td.eq(0).attr('data-value');

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
    .then(R.prepend(`Alright! Here's the top 10 **most used** items for **${toTitleCase(hero)}** this month:\n`))
    .then(R.join('\n'));
}

function commands(client, e, suffix, lang) {
  const command = suffix.toLowerCase().split(' ')[0];

  if (command === 'build') return build(suffix);
  if (command === 'builds') return build(suffix);
  if (command === 'best') return best(suffix);
  if (command === 'counter') return counters(suffix);
  if (command === 'counters') return counters(suffix);
  if (command === 'impact') return impact();
  if (command === 'item') return items(suffix);
  if (command === 'items') return items(suffix);
  if (command === 'matchup') return counters(suffix);
  if (command === 'matchups') return counters(suffix);
  if (command === 'skill') return build(suffix);
  if (command === 'skills') return build(suffix);
  return helpText(client, e, 'dota2', lang);
}

export default {
  dota: commands,
  dota2: commands
};

export const help = {
  dota2: {
    header_text: 'dota2_header_text',
    static_texts: {
      dota_positions: '**Mid**, **Off**, **Safe**, and **Jungle**'
    },
    subcommands: [
      {
        name: 'best',
        parameters: ['position']
      },
      {
        name: 'build',
        parameters: ['hero-nane']
      },
      {
        name: 'counters',
        parameters: ['hero-name']
      },
      {name: 'impact'},
      {
        name: 'items',
        parameters: ['hero-name']
      }
    ]
  }
};
