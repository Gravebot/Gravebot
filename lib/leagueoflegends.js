import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';

import sentry from './config/sentry';

const request = Promise.promisify(_request);

const help_text = `League of Legends help commands
Accepted positions are **Top**, **Mid**, **ADC**, **Jungle**, and **Support**.

**\`!lol bans\`**
    Get the top 10 most common bans
**\`!lol best\`** \`position\`
    Get the top 10 best champs for a position
**\`!lol counters\`** \`champ-name\` \`position\`
    Get the top 10 counters for a Champion and Position
**\`!lol items\`** \`champ-name\` \`position\`
    Get the highest win item sets for a Champion and Position
**\`!lol skills\`** \`champ-name\` \`position\`
    Get the highest win skills for a Champion and Position
**\`!lol status\`**
    Get the LoL Game and Client server status for all regions`;

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

function _getOrdinal(n) {
  let s = ['th', 'st', 'nd', 'rd'];
  let v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function counters(bot, msg, suffix) {
  let query = suffix.toLowerCase().replace('counters ', '').replace('counter ', '');
  let position = R.last(query.split(' ')).toLowerCase();
  let champ = query.replace(` ${position}`, '');

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
      return R.addIndex(R.map)((champ, idx) => `*${_getOrdinal(idx + 1)}*. **${champ.key}** - ${100 - champ.winRate}% win rate over ${champ.games} games.`, data);
    })
    .then(R.prepend(`Sure! Here's the top 10 **statistical** counters for **${toTitleCase(champ)} ${gg_position}**:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

// Retrieves all items from Riot, then parses just the names.
function _itemNames(item_data) {
  let options = {
    url: 'https://ddragon.leagueoflegends.com/cdn/5.24.2/data/en_US/item.json',
    json: true
  };

  return request(options)
    .then(R.path(['body', 'data']))
    .then(data => R.zipObj(R.keys(data), R.pluck('name')(R.values(data))))
    .then(items_list => {
      item_data.item_names = R.addIndex(R.map)((item_id, idx) => `*${_getOrdinal(idx + 1)}*. ${items_list[item_id]}`, item_data.items);

      return item_data;
    });
}


function items(bot, msg, suffix) {
  let query = suffix.toLowerCase().replace('items ', '');
  let position = R.last(query.split(' ')).toLowerCase();
  let champ = query.replace(` ${position}`, '');

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

function skills(bot, msg, suffix) {
  let query = suffix.toLowerCase().replace('skills ', '').replace('skill ', '');
  let position = R.last(query.split(' ')).toLowerCase();
  let champ = query.replace(` ${position}`, '');

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

function bans(bot, msg) {
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
      return R.addIndex(R.map)((champ, idx) => `*${_getOrdinal(idx + 1)}*. **${toTitleCase(champ)}**`, champs);
    })
    .then(R.prepend(`You got it! Here's the top 10 most common bans:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function best(bot, msg, suffix) {
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
      return R.addIndex(R.map)((champ, idx) => `*${_getOrdinal(idx + 1)}*. **${champ.name}** with a ${champ.general.winPercent}% winrate.`, data);
    })
    .then(R.prepend(`Sick! Here's the top 10 **statistically** best for **${gg_position}**:\n`))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function serverStatus(bot, msg) {
  let options = {
    url: 'http://status.leagueoflegends.com/shards',
    json: true
  };

  request(options)
    .then(R.prop('body'))
    .then(R.pluck('slug'))
    .map(slug => {
      let options = {
        url: `http://status.leagueoflegends.com/shards/${slug}`,
        json: true
      };

      return request(options)
        .then(R.path(['body', 'services']))
        .then(services => {
          let client = R.find(R.propEq('slug', 'client'), services);
          let game = R.find(R.propEq('slug', 'game'), services);
          return `${slug.toUpperCase()}:
- Game: **${game.status}**
- Client: **${client.status}**`;
        });
    }, {concurrency: Infinity})
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  lol: (bot, msg, suffix) => {
    if (!nconf.get('CHAMPIONGG_API')) {
      return bot.sendMessage(msg.channel, 'Please setup Champion.gg in config.js to use the **`!lol`** command.');
    }

    let command = suffix.toLowerCase().split(' ')[0];

    if (command === 'bans') return bans(bot, msg);
    if (command === 'ban') return bans(bot, msg);
    if (command === 'best') return best(bot, msg, suffix);
    if (command === 'build') return items(bot, msg, suffix);
    if (command === 'builds') return items(bot, msg, suffix);
    if (command === 'counters') return counters(bot, msg, suffix);
    if (command === 'counter') return counters(bot, msg, suffix);
    if (command === 'items') return items(bot, msg, suffix);
    if (command === 'skill') return skills(bot, msg, suffix);
    if (command === 'skills') return skills(bot, msg, suffix);
    if (command === 'server-status') return serverStatus(bot, msg, suffix);
    if (command === 'serverstatus') return serverStatus(bot, msg, suffix);
    if (command === 'status') return serverStatus(bot, msg, suffix);
    return bot.sendMessage(msg.channel, help_text);
  }
};
