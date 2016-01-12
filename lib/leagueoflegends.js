import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';
import SuperError from 'super-error';

import sentry from './config/sentry';
import { lol_champs as champions, lol_items } from '../data';
import { getOrdinal, secondDec, toTitleCase } from './helpers';

const request = Promise.promisify(_request);

// Error instances
const NotFoundError = SuperError.subclass('NotFoundError', function(msg) {
  this.message = msg || 'Not Found';
  this.code = 404;
});

const help_text = `League of Legends help commands

Accepted positions are **Top**, **Mid**, **ADC**, **Jungle**, and **Support**.
Accepted regions are **br, eune, euw, kr, lan, las, na, oce, pbe, ru, and tr**.

**\`!lol bans\`**
    Get the top 10 most common bans
**\`!lol best\`** \`position\`
    Get the top 10 best champs for a position
**\`!lol counters\`** \`champ-name\` \`position\`
    Get the top 10 counters for a Champion and Position
**\`!lol items\`** \`champ-name\` \`position\`
    Get the highest win item sets for a Champion and Position
**\`!lol match\`** \`region\` \`summoner-name\`
    Get rank, champ, winrate, and games for all players in a __current__ match.
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

// List of regions
const regions = ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'pbe', 'ru', 'tr'];

// Setup and makes request to Champion.GG API
function _makeCGGRequest(options) {
  let default_options = {
    qs: {api_key: nconf.get('CHAMPIONGG_API')},
    json: true
  };

  if (options.qs) options.qs = R.merge(default_options.qs, options.qs);
  return request(R.merge(default_options, options, true))
    .then(R.prop('body'))
    .tap(body => {
      if (body.error) throw new Error(body.error);
      console.log(JSON.stringify(body));
    });
}

// Setup and makes request to Riot API
function _makeRiotRequest(url) {
  let options = {
    url: url,
    qs: {api_key: nconf.get('RIOT_KEY')},
    json: true
  };

  return request(options)
    .tap(res => {
      if (res.statusCode === 404) throw new NotFoundError();
      if (res.statusCode >= 500) throw new Error(res.statusCode);
    })
    .then(R.prop('body'));
}

function counters(bot, msg, suffix) {
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
  return _makeCGGRequest(options)
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

function items(bot, msg, suffix) {
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

  return _makeCGGRequest(options)
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

  return _makeCGGRequest(options)
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

  return _makeCGGRequest(options)
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

function best(bot, msg, suffix) {
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

  return _makeCGGRequest(options)
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

// Gets all summoners in a live match
function _getMatchSummoners(region, name, summoner_id) {
  let observer_region = R.toUpper(region);
  observer_region = !R.contains(region, ['KR', 'RU']) ? observer_region + '1' : observer_region;

  return _makeRiotRequest(`https://${region}.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/${observer_region}/${summoner_id}`)
    .then(R.prop('participants'))
    .catch(NotFoundError, err => {
      console.error(err);
      throw new Error(`**${name}** isn't in a game.`);
    });
}

// Adds rank to summoner object
function _getRanks(region, summoners) {
  let summoners_data = R.zipObj(R.pluck('summonerId')(summoners), R.map(summoner => {
    summoner.rank = 'Unranked';
    return summoner;
  }, summoners));
  let summoner_ids = R.join(',', R.keys(summoners_data));

  return _makeRiotRequest(`https://${region}.api.pvp.net/api/lol/${region}/v2.5/league/by-summoner/${summoner_ids}/entry`)
    .then(R.values)
    .map(R.nth(0))
    .filter(rank_data => rank_data.queue !== 'RANKED_TEAM_5x5')
    .catch(NotFoundError, err => {
      // If a player hasn't played ranked at all, I believe it throws a 404.
      console.error(err);
      return {};
    })
    .each(rank_data => {
      if (!rank_data.entries) return;
      let summoner_id = rank_data.entries[0].playerOrTeamId;
      summoners_data[summoner_id].rank = `${toTitleCase(R.toLower(rank_data.tier))} ${rank_data.entries[0].division}`;
    })
    .then(() => R.values(summoners_data));
}

// Get stats for a specific champion and summoner.
function _getChampStats(region, summoner) {
  return _makeRiotRequest(`https://${region}.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summoner.summonerId}/ranked`)
    .then(R.prop('champions'))
    .then(champs => R.zipObj(R.pluck('id')(champs), R.pluck('stats')(champs)))
    .catch(NotFoundError, err => {
      // If a player hasn't played ranked at all, I believe it throws a 404.
      console.error(err);
      return {};
    })
    .then(champ_stats => {
      let champion_id = summoner.championId.toString();
      summoner.champion_stats = {
        name: champions[champion_id],
        games: 0,
        winrate: 0
      };

      if (champ_stats[champion_id]) {
        summoner.champion_stats.games = champ_stats[champion_id].totalSessionsPlayed;
        summoner.champion_stats.winrate = secondDec(champ_stats[champion_id].totalSessionsWon / champ_stats[champion_id].totalSessionsPlayed * 100);
      }
      return summoner;
    });
}

function _formatPlayerStats(summoners) {
  return R.map(summoner => {
    return `    **${summoner.summonerName}** - ${summoner.rank} - **${summoner.champion_stats.name}**,  __${summoner.champion_stats.winrate}%__ winrate over __${summoner.champion_stats.games} games__`;
  }, summoners);
}

function matchDetails(bot, msg, suffix) {
  if (!nconf.get('RIOT_KEY')) {
    return bot.sendMessage(msg.channel, 'Please setup Riot\'s API in config.js to use the **`!lol`** command.');
  }

  let suffix_split = suffix.split(' ');
  let region = suffix_split[1].toLowerCase();
  let name = R.join(' ', R.slice(2, 20, suffix_split));
  let summoner_id;

  // If it's a mention
  if (msg.mentions.length !== 0) name = msg.mentions[0].username;
  // If no name, use authorx
  if (!name) name = msg.author.username;

  console.log(`I don't understand region **${region}**. Accepted regions are **${R.join(', ', regions)}**.`);
  if (!R.contains(region, regions)) return bot.sendMessage(msg.channel, `I don't understand region **${region}**. Accepted regions are **${R.join(', ', regions)}**.`);
  if (!name) {
    bot.sendMessage(msg.channel, 'You need to specifiy a summoner name.');
    return bot.sendMessage(msg.channel, help_text);
  }

  _makeRiotRequest(`https://${region}.api.pvp.net/api/lol/${region}/v1.4/summoner/by-name/${name}`)
    .catch(NotFoundError, err => {
      console.error(err);
      throw new Error(`I can't find **${name}** in the **${region}** region.`);
    })
    .then(R.values)
    .then(R.nth(0))
    .then(R.prop('id'))
    .tap(id => {
      summoner_id = id;
    })
    .then(R.curry(_getMatchSummoners)(region, name))
    .then(R.curry(_getRanks)(region))
    .map(R.curry(_getChampStats)(region), {concurrency: Infinity})
    .then(data => {
      let blue_side = R.filter(summoner => summoner.teamId === 100, data);
      let red_side = R.filter(summoner => summoner.teamId === 200, data);
      let blue_side_text = `__Blue Side:__\n${R.join('\n', _formatPlayerStats(blue_side))}`;
      let red_side_text = `__Red Side:__\n${R.join('\n', _formatPlayerStats(red_side))}`;

      let summoner_team_id = R.find(R.propEq('summonerId', summoner_id))(data).teamId;
      let summoner_team = summoner_team_id === 100 ? 'Blue' : 'Red';

      let title_text = `Game on! You can find **${name}** on __${summoner_team}__ side.`;
      bot.sendMessage(msg.channel, R.join('\n\n', [title_text, blue_side_text, red_side_text]));
    })
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  lol: (bot, msg, suffix) => {
    let command = suffix.toLowerCase().split(' ')[0];

    if (command === 'bans') return bans(bot, msg);
    if (command === 'ban') return bans(bot, msg);
    if (command === 'best') return best(bot, msg, suffix);
    if (command === 'build') return items(bot, msg, suffix);
    if (command === 'builds') return items(bot, msg, suffix);
    if (command === 'counters') return counters(bot, msg, suffix);
    if (command === 'counter') return counters(bot, msg, suffix);
    if (command === 'items') return items(bot, msg, suffix);
    if (command === 'match') return matchDetails(bot, msg, suffix);
    if (command === 'skill') return skills(bot, msg, suffix);
    if (command === 'skills') return skills(bot, msg, suffix);
    if (command === 'server-status') return serverStatus(bot, msg, suffix);
    if (command === 'serverstatus') return serverStatus(bot, msg, suffix);
    if (command === 'status') return serverStatus(bot, msg, suffix);
    return bot.sendMessage(msg.channel, help_text);
  }
};
