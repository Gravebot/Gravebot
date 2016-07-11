import Promise from 'bluebird';
import didyoumean from 'didyoumean';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';
import SuperError from 'super-error';

import { lol_champs, lol_items } from '../../../data';
import { getOrdinal, toTitleCase } from '../../../helpers';
import phantom from '../../../phantom';
import T from '../../../translate';


const request = Promise.promisify(_request);

// Error instances
const Warning = SuperError.subclass('Warning', function(msg) {
  this.message = msg || 'Not Found';
  this.code = 404;
  this.level = 'warning';
});

const ApiDown = SuperError.subclass('ApiDown', function() {
  this.message = 'Champion.gg\'s API is down';
  this.code = 404;
  this.level = 'warning';
});

// List of possible phrases used for positions
const positions = {
  top: 'Top',
  mid: 'Middle',
  middle: 'Middle',
  jungle: 'Jungle',
  jungler: 'Jungle',
  jg: 'Jungle',
  bot: 'ADC',
  adc: 'ADC',
  support: 'Support',
  sup: 'Support',
  supp: 'Support'
};

// Setup and makes request to Champion.GG API
function _makeRequest(options) {
  let default_options = {
    qs: {api_key: nconf.get('CHAMPIONGG_KEY')},
    json: true
  };

  if (options.qs) options.qs = R.merge(default_options.qs, options.qs);
  return request(R.merge(default_options, options, true))
    .tap(res => {
      if (res.statusCode === 521) throw new ApiDown();
    })
    .then(R.prop('body'))
    .tap(body => {
      if (body.error) {
        if (body.error === 'ChampionNotFound') throw new Warning(body.error);
        throw new Error(body.error);
      }
    });
}

// Verify name of a champ. If champ is not found, do a closest string match to find it.
// If no champ can be matched, return the string anyway incase it's a new champ that hasn't been added yet.
function _verifyName(champ) {
  const champ_reg = champ.toLowerCase().replace(/[^a-z]/g, '');
  if (!lol_champs[champ_reg]) {
    const champ_search = didyoumean(champ_reg, R.keys(lol_champs));
    if (champ_search) return champ_search;
  }
  return champ_reg;
}

export function counters(suffix, lang) {
  if (!nconf.get('CHAMPIONGG_KEY')) return Promise.resolve(T('champgg_setup', lang));

  const suffix_split = suffix.split(' ');
  const position = R.last(suffix_split).toLowerCase();
  const champ = R.join(' ', R.slice(1, -1, suffix_split));
  const champ_reg = _verifyName(champ);

  if (position === champ) return Promise.resolve(`${T('lol_specify_position', lang)} ${T('lol_positions', lang)}`);

  if (!R.contains(position, R.keys(positions))) return Promise.resolve(`${T('lol_unknown_position', lang)} **${position}**. ${T('lol_positions', lang)}`);
  const gg_position = positions[position];

  const options = {
    url: `http://api.champion.gg/champion/${champ_reg}/matchup`
  };
  return _makeRequest(options)
    .then(body => {
      let results = R.zipObj(R.pluck('role')(body), body);
      if (!R.contains(gg_position, R.keys(results))) throw new Warning(`${T('no_counters', lang)} **${champ}** **${position}**.`);
      return results[gg_position];
    })
    .then(R.prop('matchups'))
    .then(R.sortBy(R.prop('statScore')))
    .then(R.slice(0, 10))
    .then(data => {
      const champ_data = lol_champs[champ_reg];
      const counters_data = {
        name: champ_data.name,
        position: gg_position,
        image: champ_data.image
      };

      counters_data.counters = R.addIndex(R.map)((champ, idx) => {
        champ.key = champ.key.toLowerCase();
        if (champ.key === 'monkeyking') champ.key = 'wukong';

        champ.position = getOrdinal(idx + 1);
        champ.image = champ.key.toLowerCase();
        champ.name = lol_champs[champ.key].name;
        return champ;
      }, data);

      return phantom('lol_counters', counters_data);
    })
    .then(buf => ({upload: buf, filename: `counters_${champ}_${gg_position}.png`}));
}

export function items(suffix, lang) {
  if (!nconf.get('CHAMPIONGG_KEY')) return Promise.resolve(T('champgg_setup', lang));

  const suffix_split = suffix.split(' ');
  const position = R.last(suffix_split).toLowerCase();
  const champ = R.join(' ', R.slice(1, -1, suffix_split));
  const champ_reg = _verifyName(champ);

  if (position === champ) return Promise.resolve(`${T('lol_specify_position', lang)} ${T('lol_positions', lang)}`);

  const options = {
    url: `http://api.champion.gg/champion/${champ_reg}/items/finished/mostWins`
  };

  if (!R.contains(position, R.keys(positions))) return Promise.resolve(`${T('lol_unknown_position', lang)} **${position}**. ${T('lol_positions', lang)}`);
  let gg_position = positions[position];

  return _makeRequest(options)
    .then(body => {
      const results = R.zipObj(R.pluck('role')(body), body);
      if (!R.contains(gg_position, R.keys(results))) throw new Warning(`${T('no_item_sets', lang)} **${champ}** **${position}**.`);
      return results[gg_position];
    })
    .then(item_data => {
      const champ_data = lol_champs[champ_reg];
      if (!item_data.items.length) throw new Warning(`${T('no_item_sets', lang)} **${champ}** **${position}**.`);

      item_data.names = R.map(item_id => lol_items[item_id], item_data.items);
      item_data.champ_name = champ_data.name;
      item_data.image = champ_data.image;
      return phantom('lol_items', item_data, 500, 300);
    })
    .then(buf => ({upload: buf, filename: `items_${champ}_${gg_position}.png`}));
}

export function skills(suffix, lang) {
  if (!nconf.get('CHAMPIONGG_KEY')) return Promise.resolve(T('champgg_setup', lang));

  const suffix_split = suffix.split(' ');
  const position = R.last(suffix_split).toLowerCase();
  const champ = R.join(' ', R.slice(1, -1, suffix_split));
  const champ_reg = _verifyName(champ);
  const champ_data = lol_champs[champ_reg];

  if (position === champ) return Promise.resolve(`${T('lol_specify_position', lang)} ${T('lol_positions', lang)}`);

  const options = {
    url: `http://api.champion.gg/champion/${champ_reg}/skills/mostWins`
  };

  if (!R.contains(position, R.keys(positions))) return Promise.resolve(`${T('lol_unknown_position', lang)} **${position}**. ${T('lol_positions', lang)}`);
  const gg_position = positions[position];

  return _makeRequest(options)
    .then(body => {
      let results = R.zipObj(R.pluck('role')(body), body);
      if (!R.contains(gg_position, R.keys(results))) throw new Warning(`${T('no_skills', lang)} **${champ}** **${position}**.`);
      return results[gg_position];
    })
    .then(R.prop('order'))
    .then(skills => {
      // Calculate skill order.
      let skill_count = R.countBy(R.toLower)(R.slice(0, 9, skills));
      delete skill_count.r;
      skill_count = R.invertObj(skill_count);
      const counts = R.keys(skill_count).sort().reverse();
      const skill_order = R.join('>', R.map(count_num => {
        return R.toUpper(skill_count[count_num]);
      }, counts));

      return `Okay! Here's the skill order for **${champ_data.name} ${gg_position}**.

**Skill Priority:** ${skill_order}
**Full Order:** ${skills.join(',')}`;
    });
}

export function bans(lang) {
  if (!nconf.get('CHAMPIONGG_KEY')) return Promise.resolve(T('champgg_setup', lang));

  const options = {
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
    .then(R.join('\n'));
}

export function best(suffix, lang) {
  if (!nconf.get('CHAMPIONGG_KEY')) return Promise.resolve(T('champgg_setup', lang));

  const position = R.last(suffix.split(' ')).toLowerCase();

  if (!position || position === 'best') return Promise.resolve(`${T('lol_specify_position', lang)} ${T('lol_positions', lang)}`);
  if (!R.contains(position, R.keys(positions))) return Promise.resolve(`${T('lol_unknown_position', lang)} **${position}**. ${T('lol_positions', lang)}`);
  const gg_position = positions[position];

  const options = {
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
    .then(R.join('\n'));
}
