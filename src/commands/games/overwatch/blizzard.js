import Promise from 'bluebird';
import cheerio from 'cheerio';
import { remove as removeDiacritics } from 'diacritics';
import R from 'ramda';
import SuperError from 'super-error';

import phantom from '../../../phantom';


const request = Promise.promisify(require('request'));

const Warning = SuperError.subclass('Warning', function(msg) {
  this.message = msg || 'Not Found';
  this.code = 404;
  this.level = 'warning';
});

const EMPTY_HERO = {
  value: '0',
  meta: {
    progress_bar_percent: 0
  }
};

function _getRegion(battletag) {
  return Promise.filter(['eu', 'us', 'cn', 'kr'], region => {
    return request({
      url: `https://playoverwatch.com/en-gb/career/pc/${region}/${battletag}`,
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
      }
    })
    .then(res => {
      if (res.statusCode >= 400) return false;
      return true;
    });
  })
  .then(R.head);
}

function _makeRequest(player_name, region) {
  const battletag = player_name.replace(/#/g, '-');
  if (R.last(battletag.split('-')).replace(/[0-9]/g, '').length !== 0) {
    return Promise.reject(new Warning(`**${player_name}** isn't a valid Battletag. It requires your username and number that can be found in your blizzard client. E.g. **PlayerName#1234**`));
  }

  let region_promise = Promise.resolve(region);
  if (!region) region_promise = _getRegion(battletag);
  const notfounderror = new Warning(`Couldn't find battletag ${player_name}. Remember that battletags are case sensitive.`);

  return region_promise.then(region => {
    if (!region) throw notfounderror;
    return request({
      url: `https://playoverwatch.com/en-gb/career/pc/${region}/${battletag}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
      }
    });
  })
  .then(res => {
    if (res.statusCode >= 400) throw notfounderror;
    const $ = cheerio.load(res.body);
    return [$, {
      name: $('.header-masthead').text(),
      games_won: $('.masthead-detail > span').text().replace(/[^0-9]/g, ''),
      level: $('.player-level > div').html()
    }];
  });
}

function _getHeroStats($, position) {
  const entries = $('.progress-category').eq(position).children().map((idx, el) => {
    el = $(el);
    const name = removeDiacritics(el.find('.title').text());
    return {
      name,
      image_name: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      value: el.find('.description').text(),
      meta: {
        progress_bar_percent: Number(el.attr('data-overwatch-progress-percent')) * 100
      }
    };
  }).get();

  return R.zipObj(R.pluck('name', entries), entries);
}

function _processHeroStats($, position) {
  const normals = _getHeroStats($, position);
  const competitive = _getHeroStats($, position + 6);
  const heroes = R.map(hero => {
    const source = R.clone(normals[hero] || competitive[hero]);
    normals[hero] = normals[hero] || EMPTY_HERO;
    competitive[hero] = competitive[hero] || EMPTY_HERO;
    source.value = `${normals[hero].value} / ${competitive[hero].value}`;
    source.meta.progress_bar_percent = Math.ceil((normals[hero].meta.progress_bar_percent + competitive[hero].meta.progress_bar_percent) / 2);
    return source;
  }, R.uniq(R.concat(R.keys(normals), R.keys(competitive))));

  return R.sort((a, b) => {
    return b.meta.progress_bar_percent - a.meta.progress_bar_percent;
  }, R.values(heroes));
}

export function averages(player_name, region) {
  return _makeRequest(player_name, region)
    .spread(($, data) => phantom('ow_playerstats', R.merge(data, {
      averages: {
        eliminations: {
          name: 'Eliminations',
          value: $('.card-heading').eq(0).text()
        },
        damage: {
          name: 'Damage Done',
          value: $('.card-heading').eq(1).text()
        },
        deaths: {
          name: 'Deaths',
          value: $('.card-heading').eq(2).text()
        },
        final_blows: {
          name: 'Final Blows',
          value: $('.card-heading').eq(3).text()
        },
        healing: {
          name: 'Healing Done',
          value: $('.card-heading').eq(4).text()
        },
        objective_kills: {
          name: 'Objective Kills',
          value: $('.card-heading').eq(5).text()
        },
        objective_time: {
          name: 'Objective Time',
          value: $('.card-heading').eq(6).text()
        },
        solo_kills: {
          name: 'Solo Kills',
          value: $('.card-heading').eq(7).text()
        }
      }
    })))
    .then(buf => ({upload: buf, filename: 'gravebot_overwatch_averages.png'}));
}

export function timePlayed(player_name, region) {
  return _makeRequest(player_name, region)
    .spread(($, data) => phantom('ow_herostats', R.merge(data, {
      stat_name: 'Time Played',
      heroes: _processHeroStats($, 0)
    })))
    .then(buf => ({upload: buf, filename: 'gravebot_overwatch_timeplayed.png'}));
}

export function gamesWon(player_name, region) {
  return _makeRequest(player_name, region)
    .spread(($, data) => phantom('ow_herostats', R.merge(data, {
      stat_name: 'Games Won',
      heroes: _processHeroStats($, 1)
    })))
    .then(buf => ({upload: buf, filename: 'gravebot_overwatch_gameswon.png'}));
}

// export function winPercent(player_name, region) {
  // return _makeRequest(player_name, region)
    // .spread(($, data) => phantom('ow_herostats', R.merge(data, {
      // stat_name: 'Win Percent',
      // heroes: _processHeroStats($, 2)
    // })))
    // .then(buf => ({upload: buf, filename: 'gravebot_overwatch_winpercent.png'}));
// }

export function weaponAccuracy(player_name, region) {
  return _makeRequest(player_name, region)
    .spread(($, data) => phantom('ow_herostats', R.merge(data, {
      stat_name: 'Weapon Accuracy',
      heroes: _processHeroStats($, 2)
    })))
    .then(buf => ({upload: buf, filename: 'gravebot_overwatch_accuracy.png'}));
}

export function eliminations(player_name, region) {
  return _makeRequest(player_name, region)
    .spread(($, data) => phantom('ow_herostats', R.merge(data, {
      stat_name: 'Eliminations Per Life',
      heroes: _processHeroStats($, 3)
    })))
    .then(buf => ({upload: buf, filename: 'gravebot_overwatch_eliminations.png'}));
}

// export function killStreak(player_name, region) {
//   return _makeRequest(player_name, region)
//     .spread(($, data) => phantom('ow_herostats', R.merge(data, {
//       stat_name: 'Kill Streak',
//       heroes: _processHeroStats($, $('.progress-category').eq(5).children())
//     })))
//     .then(buf => ({upload: buf, filename: 'gravebot_overwatch_killstreak.png'}));
// }

export function multikill(player_name, region) {
  return _makeRequest(player_name, region)
    .spread(($, data) => phantom('ow_herostats', R.merge(data, {
      stat_name: 'Multikill',
      heroes: _processHeroStats($, 4)
    })))
    .then(buf => ({upload: buf, filename: 'gravebot_overwatch_multikill.png'}));
}

export function objectiveKills(player_name, region) {
  return _makeRequest(player_name, region)
    .spread(($, data) => phantom('ow_herostats', R.merge(data, {
      stat_name: 'Objective Kills',
      heroes: _processHeroStats($, 5)
    })))
    .then(buf => ({upload: buf, filename: 'gravebot_overwatch_objectivekills.png'}));
}
