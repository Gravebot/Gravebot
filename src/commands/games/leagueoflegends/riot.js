import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';
import SuperError from 'super-error';

import { lol_champs } from '../../../data';
import { subCommands as helpText } from '../../help';
import { secondDec, toTitleCase } from '../../../helpers';
import T from '../../../translate';


const request = Promise.promisify(_request);
const champions = R.values(lol_champs);

// Error instances
const NotFoundError = SuperError.subclass('NotFoundError', function(msg) {
  this.message = msg || 'Not Found';
  this.code = 404;
  this.level = 'warning';
});

const NotYetAvailable = SuperError.subclass('NotYetAvailable', function(msg) {
  this.message = msg || 'Match details are not yet availabe from Riot';
  this.code = 503;
  this.level = 'warning';
});

const Warning = SuperError.subclass('Warning', function(msg) {
  this.message = msg || 'Not Found';
  this.code = 404;
  this.level = 'warning';
});

// List of regions
const regions = ['br', 'eune', 'euw', 'jp', 'kr', 'lan', 'las', 'na', 'oce', 'ru', 'tr'];

// Setup and makes request to Riot API
function _makeRequest(url) {
  const options = {
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

export function serverStatus() {
  const options = {
    url: 'http://status.leagueoflegends.com/shards',
    json: true
  };

  return request(options)
    .then(R.prop('body'))
    .then(R.pluck('slug'))
    .map(slug => {
      const options = {
        url: `http://status.leagueoflegends.com/shards/${slug}`,
        json: true
      };

      return request(options)
        .then(R.path(['body', 'services']))
        .then(services => {
          const client = R.find(R.propEq('slug', 'client'), services);
          const game = R.find(R.propEq('slug', 'game'), services);
          return `${slug.toUpperCase()}:
- Game: **${game.status}**
- Client: **${client.status}**`;
        });
    }, {concurrency: Infinity})
    .then(R.join('\n'));
}

// Gets all summoners in a live match
function _getMatchSummoners(region, name, summoner_id) {
  let observer_region = R.toUpper(region);
  observer_region = !R.contains(observer_region, ['KR', 'RU']) ? observer_region + '1' : observer_region;
  if (observer_region === 'OCE1') observer_region = 'OC1';
  if (observer_region === 'EUNE1') observer_region = 'EUN1';
  if (observer_region === 'LAN1') observer_region = 'LA1';
  if (observer_region === 'LAS1') observer_region = 'LA2';

  return _makeRequest(`https://${region}.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/${observer_region}/${summoner_id}`)
    .tap(data => {
      if (data.status && data.status.status_code === 403) throw new NotYetAvailable();
    })
    .then(R.prop('participants'))
    .tap(summoners => {
      if (!summoners) throw new NotYetAvailable();
    })
    .catch(NotFoundError, err => {
      console.error(err);
      throw new Warning(`**${name}** isn't in a game.`);
    });
}

// Adds rank to summoner object
function _getRanks(region, summoners) {
  const summoners_data = R.zipObj(R.pluck('summonerId')(summoners), R.map(summoner => {
    summoner.rank = 'Unranked';
    return summoner;
  }, summoners));
  const summoner_ids = R.join(',', R.keys(summoners_data));

  return _makeRequest(`https://${region}.api.pvp.net/api/lol/${region}/v2.5/league/by-summoner/${summoner_ids}/entry`)
    .then(R.values)
    .map(R.nth(0))
    .filter(rank_data => rank_data.queue !== 'RANKED_TEAM_5x5' && rank_data.queue !== 'RANKED_TEAM_3x3')
    .catch(NotFoundError, err => {
      // If a player hasn't played ranked at all, I believe it throws a 404.
      console.error(err);
      return {};
    })
    .each(rank_data => {
      if (!rank_data.entries) return;
      const summoner_id = rank_data.entries[0].playerOrTeamId;
      summoners_data[summoner_id].rank = `${toTitleCase(R.toLower(rank_data.tier))} ${rank_data.entries[0].division}`;
    })
    .then(() => R.values(summoners_data));
}

// Get stats for a specific champion and summoner.
function _getChampStats(region, summoner) {
  return _makeRequest(`https://${region}.api.pvp.net/api/lol/${region}/v1.3/stats/by-summoner/${summoner.summonerId}/ranked`)
    .then(R.prop('champions'))
    .then(champs => R.zipObj(R.pluck('id')(champs), R.pluck('stats')(champs)))
    .catch(NotFoundError, err => {
      // If a player hasn't played ranked at all, I believe it throws a 404.
      console.error(err);
      return {};
    })
    .then(champ_stats => {
      const champion_id = summoner.championId.toString();
      const champ_name = R.find(R.propEq('id', champion_id))(champions).name;
      summoner.champion_stats = {
        name: champ_name,
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

export function matchDetails(client, evt, suffix, lang) {
  if (!nconf.get('RIOT_KEY')) return Promise.resolve(T('riot_setup', lang));

  const suffix_split = suffix.split(' ');
  if (!suffix_split[1]) return Promise.resolve(`Accepted regions are **${R.join(', ', regions)}**.`);

  const region = suffix_split[1].toLowerCase();
  let name = R.join(' ', R.slice(2, 20, suffix_split));
  let summoner_id;

  // If it's a mention
  if (evt.message.mentions.length !== 0) name = evt.message.mentions[0].username;
  // If no name, use author
  if (!name) name = evt.message.author.username;

  if (!R.contains(region, regions)) return Promise.resolve(`I don't understand region **${region}**. Accepted regions are **${R.join(', ', regions)}**.`);
  if (!name) return Promise.join([T('specify_summoner', lang), helpText(client, evt, 'lol', lang)]);

  return _makeRequest(`https://${region}.api.pvp.net/api/lol/${region}/v1.4/summoner/by-name/${name}`)
    .catch(NotFoundError, err => {
      console.error(err);
      throw new Warning(`I can't find **${name}** in the **${region}** region.`);
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
      const blue_side = R.filter(summoner => summoner.teamId === 100, data);
      const red_side = R.filter(summoner => summoner.teamId === 200, data);
      const blue_side_text = `__Blue Side:__\n${R.join('\n', _formatPlayerStats(blue_side))}`;
      const red_side_text = `__Red Side:__\n${R.join('\n', _formatPlayerStats(red_side))}`;

      const summoner_team_id = R.find(R.propEq('summonerId', summoner_id))(data).teamId;
      const summoner_team = summoner_team_id === 100 ? 'Blue' : 'Red';

      const title_text = `Game on! You can find **${name}** on __${summoner_team}__ side.`;
      return R.join('\n\n', [title_text, blue_side_text, red_side_text]);
    });
}
