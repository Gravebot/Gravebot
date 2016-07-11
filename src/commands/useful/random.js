import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import Randomorg from 'random-org';

import T from '../../translate';
import { subCommands as helpText } from '../help';


const rand = new Randomorg({apiKey: nconf.get('RANDOM_KEY')});

function fraction(client, evt, suffix, lang) {
  if (!nconf.get('RANDOM_KEY')) return Promise.resolve(T('random_setup', lang));
  if (!suffix) return Promise.resolve(T('fraction_usage', lang));
  let n = suffix.split(' ')[0];
  if (!n) n = 1;
  let decimalPlaces = suffix.split(' ')[1];
  if (!decimalPlaces) decimalPlaces = 5;
  let replacement = true;
  if (suffix.indexOf('replace') !== -1) replacement = false;
  return rand.generateDecimalFractions({n: n, decimalPlaces: decimalPlaces, replacement: replacement})
  .then(result => {
    return R.join(', ', result.random.data);
  });
}

function gaussian(client, evt, suffix, lang) {
  if (!nconf.get('RANDOM_KEY')) return Promise.resolve(T('random_setup', lang));
  if (!suffix) return Promise.resolve(T('gaussian_usage', lang));
  let n = suffix.split(' ')[0];
  if (!n) n = 1;
  let mean = suffix.split(' ')[1];
  if (!mean) mean = 50;
  let standardDeviation = suffix.split(' ')[2];
  if (!standardDeviation) standardDeviation = 10;
  let significantDigits = suffix.split(' ')[3];
  if (!significantDigits) significantDigits = 5;
  return rand.generateGaussians({n: n, mean: mean, standardDeviation: standardDeviation, significantDigits: significantDigits})
  .then(result => {
    return R.join(', ', result.random.data);
  });
}

function integer(client, evt, suffix, lang) {
  if (!nconf.get('RANDOM_KEY')) return Promise.resolve(T('random_setup', lang));
  if (!suffix) return Promise.resolve(T('integer_usage', lang));
  let n = suffix.split(' ')[0];
  if (!n) n = 2;
  let min = suffix.split(' ')[1];
  if (!min) min = 1;
  let max = suffix.split(' ')[2];
  if (!max) max = 50;
  let replacement = true;
  if (suffix.indexOf('replace') !== -1) replacement = false;
  return rand.generateIntegers({n: n, min: min, max: max, replacement: replacement})
  .then(result => {
    return R.join(', ', result.random.data);
  });
}

function string(client, evt, suffix, lang) {
  if (!nconf.get('RANDOM_KEY')) return Promise.resolve(T('random_setup', lang));
  if (!suffix) return Promise.resolve(T('string_usage', lang));
  let n = suffix.split(' ')[0];
  if (!n) n = 1;
  let length = suffix.split(' ')[1];
  if (!length) length = 10;
  let characters = suffix.split(' ')[2];
  if (!characters) characters = 'abcdefghijklmnopqrstuvwxyz';
  let replacement = true;
  if (suffix.indexOf('replace') !== -1) replacement = false;
  return rand.generateStrings({n: n, length: length, characters: characters, replacement: replacement})
  .then(result => {
    return R.join(', ', result.random.data);
  });
}


function random(client, evt, suffix, lang) {
  return helpText(client, evt, 'random', lang);
}

export default {
  fraction,
  gaussian,
  integer,
  rand: random,
  random,
  string
};

export const help = {
  random: {
    prefix: true,
    subcommands: [
      {
        name: 'fraction',
        parameters: ['amount']
      },
      {
        name: 'gaussian',
        parameters: ['amount']
      },
      {
        name: 'integer',
        parameters: ['amount', 'min', 'max']
      },
      {
        name: 'string',
        parameters: ['amount', 'length', 'charset(optional)']
      }
    ]
  }
};
