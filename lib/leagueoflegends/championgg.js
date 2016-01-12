import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';

import sentry from '../config/sentry';
import { lol_items } from '../../data';
import { getOrdinal, toTitleCase } from '../helpers';


const request = Promise.promisify(_request);

// List of possible phrases used for positions
const positions = {
  top: 'Top',
  mid: 'Middle',
  middle: 'Middle',
  jungle: 'Jungle',
  jg: 'Jungle',
  adc: 'ADC',
  support: 'Support',
  sup: 'Support',
  supp: 'Support'
};


// Setup and makes request to Champion.GG API
function _makeRequest(options) {
  let default_options = {
    qs: {api_key: nconf.get('CHAMPIONGG_API')},
    json: true
  };

  if (options.qs) options.qs = R.merge(default_options.qs, options.qs);
  return request(R.merge(default_options, options, true))
    .then(R.prop('body'))
    .tap(body => {
      if (body.error) throw new Error(body.error);
    });
}

export function counters(bot, msg, suffix) {
  if (!nconf.get('CHAMPIONGG_API')) {
    return bot.sendMessage(msg.channel, 'Please setup Champion.gg in config.js to use the **`!lol`** command.');
  }

  let suffix_split = suffix.split(' ');
  let position = R.last(suffix_split).toLowerCase();
  let champ = R.join(' ', R.slice(1, -1, suffix_split));

  if (position === champ) return bot.sendMessage(msg.channel, 'You didn\'t specifiy a position. Did you mean top, mid, adc, support, or jungle?');

  if (!R.contains(position, R.keys(positions))) return bot.sendMessage(msg.channel, `I don't understand position **${position}**. Did you mean top, mid, adc, support, or jungle?`);
  let gg_position = positions[position];

  let options = {
    url: `http://api.champion.gg/champion/${champ.replace(/[^a-z]/g, '')}/matchup`
  };
  return _makeRequest(options)
    .then(body => {
      let results = R.zipObj(R.pluck('role')(body), body);
      if (!R.contains(gg_position, R.keys(results))) throw new Error(`I don't have counters for ${champ} ${position}.`);
      return results[gg_position];
    })
    .then(R.prop('matchups'))
    .then(R.sortBy(R.prop('statScore')))
    .then(R.slice(0, 10))
    .then(data => {
      return R.addIndex(R.map)((champ, idx) => `*${getOrdinal(idx + 1)}*. **${champ.key}** - ${100 - champ.winRate}% win rate over ${champ.games} games.`, data);
    })
    .then(R.prepend(`Sure! Here's the top 10 **statistical** counters for **${toTitleCase(champ)} ${gg_position}**:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

// Retrieves all items from Riot, then parse just the names.
function _itemNames(item_data) {
  return Promise.resolve(lol_items)
    .then(items_list => {
      item_data.item_names = R.addIndex(R.map)((item_id, idx) => `*${getOrdinal(idx + 1)}*. ${items_list[item_id]}`, item_data.items);

      return item_data;
    });
}

export function items(bot, msg, suffix) {
  if (!nconf.get('CHAMPIONGG_API')) {
    return bot.sendMessage(msg.channel, 'Please setup Champion.gg in config.js to use the **`!lol`** command.');
  }

  let suffix_split = suffix.split(' ');
  let position = R.last(suffix_split).toLowerCase();
  let champ = R.join(' ', R.slice(1, -1, suffix_split));

  if (position === champ) return bot.sendMessage(msg.channel, 'You didn\'t specifiy a position. Did you mean top, mid, adc, support, or jungle?');

  let options = {
    url: `http://api.champion.gg/champion/${champ.replace(/[^a-z]/g, '')}/items/finished/mostWins`
  };

  if (!R.contains(position, R.keys(positions))) return bot.sendMessage(msg.channel, `I don't understand position **${position}**. Did you mean top, mid, adc, support, or jungle?`);
  let gg_position = positions[position];

  return _makeRequest(options)
    .then(body => {
      let results = R.zipObj(R.pluck('role')(body), body);
      if (!R.contains(gg_position, R.keys(results))) throw new Error(`I don't have item sets for ${champ} ${position}.`);
      return results[gg_position];
    })
    .then(_itemNames)
    .then(item_data => {
      let title = `Alright! Here's the highest win item set for **${toTitleCase(champ)}** **${gg_position}** with a ${item_data.winPercent}% winrate.\n`;
      let reply = R.join('\n', R.prepend(title, item_data.item_names));
      bot.sendMessage(msg.channel, reply);
    })
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export function skills(bot, msg, suffix) {
  if (!nconf.get('CHAMPIONGG_API')) {
    return bot.sendMessage(msg.channel, 'Please setup Champion.gg in config.js to use the **`!lol`** command.');
  }

  let suffix_split = suffix.split(' ');
  let position = R.last(suffix_split).toLowerCase();
  let champ = R.join(' ', R.slice(1, -1, suffix_split));

  if (position === champ) return bot.sendMessage(msg.channel, 'You didn\'t specifiy a position. Did you mean top, mid, adc, support, or jungle?');

  let options = {
    url: `http://api.champion.gg/champion/${champ.replace(/[^a-z]/g, '')}/skills/mostWins`
  };

  if (!R.contains(position, R.keys(positions))) return bot.sendMessage(msg.channel, `I don't understand position **${position}**. Did you mean top, mid, adc, support, or jungle?`);
  let gg_position = positions[position];

  return _makeRequest(options)
    .then(body => {
      let results = R.zipObj(R.pluck('role')(body), body);
      if (!R.contains(gg_position, R.keys(results))) throw new Error(`I don't have skill orders for ${champ} ${position}.`);
      return results[gg_position];
    })
    .then(R.prop('order'))
    .then(skills => {
      // Calculate skill order.
      let skill_count = R.countBy(R.toLower)(R.slice(0, 9, skills));
      delete skill_count.r;
      skill_count = R.invertObj(skill_count);
      let counts = R.keys(skill_count).sort().reverse();
      let skill_order = R.join('>', R.map(count_num => {
        return R.toUpper(skill_count[count_num]);
      }, counts));

      let text = `Okay! Here's the skill order for **${toTitleCase(champ)} ${gg_position}**.

**Skill Priority:** ${skill_order}
**Full Order:** ${skills.join(',')}`;

      bot.sendMessage(msg.channel, text);
    })
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export function bans(bot, msg) {
  if (!nconf.get('CHAMPIONGG_API')) {
    return bot.sendMessage(msg.channel, 'Please setup Champion.gg in config.js to use the **`!lol`** command.');
  }

  let options = {
    url: `http://api.champion.gg/stats/champs/mostBanned`,
    qs: {
      limit: 25,
      page: 1
    }
  };

  return _makeRequest(options)
    .then(R.prop('data'))
    .then(R.pluck('name'))
    .then(R.uniq)
    .then(R.slice(0, 10))
    .then(champs => {
      return R.addIndex(R.map)((champ, idx) => `*${getOrdinal(idx + 1)}*. **${toTitleCase(champ)}**`, champs);
    })
    .then(R.prepend(`You got it! Here's the top 10 most common bans:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export function best(bot, msg, suffix) {
  if (!nconf.get('CHAMPIONGG_API')) {
    return bot.sendMessage(msg.channel, 'Please setup Champion.gg in config.js to use the **`!lol`** command.');
  }

  let position = R.last(suffix.split(' ')).toLowerCase();

  if (!position || position === 'best') return bot.sendMessage(msg.channel, 'You didn\'t specifiy a position. Did you mean top, mid, adc, support, or jungle?');
  if (!R.contains(position, R.keys(positions))) return bot.sendMessage(msg.channel, `I don't understand position **${position}**. Did you mean top, mid, adc, support, or jungle?`);
  let gg_position = positions[position];

  let options = {
    url: `http://api.champion.gg/stats/role/${gg_position}/bestPerformance`,
    qs: {
      limit: 10,
      page: 1
    }
  };

  return _makeRequest(options)
    .then(R.prop('data'))
    .then(data => {
      return R.addIndex(R.map)((champ, idx) => `*${getOrdinal(idx + 1)}*. **${champ.name}** with a ${champ.general.winPercent}% winrate.`, data);
    })
    .then(R.prepend(`Sick! Here's the top 10 **statistically** best for **${gg_position}**:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}
