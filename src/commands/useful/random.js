import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import Randomorg from 'random-org';

import T from '../../translate';
import { subCommands as helpText } from '../help';


const rand = nconf.get('RANDOM_KEY') && new Randomorg({apiKey: nconf.get('RANDOM_KEY')});

function fraction(client, evt, suffix, lang) {
  if (!nconf.get('RANDOM_KEY')) return Promise.resolve(T('random_setup', lang));
  if (!suffix) return Promise.resolve(T('fraction_usage', lang));

  const split_suffix = suffix.split(' ');
  const n = split_suffix[0] || 1;
  const decimal_places = suffix.split(' ')[1] || 5;
  const replacement = suffix.indexOf('replace') === -1;

  return rand.generateDecimalFractions({n, replacement, decimalPlaces: decimal_places})
    .then(R.path(['random', 'data']))
    .then(R.join(', '));
}

function gaussian(client, evt, suffix, lang) {
  if (!nconf.get('RANDOM_KEY')) return Promise.resolve(T('random_setup', lang));
  if (!suffix) return Promise.resolve(T('gaussian_usage', lang));

  const split_suffix = suffix.split(' ');
  const n = split_suffix[0] || 1;
  const mean = split_suffix[1] || 50;
  const standard_deviation = split_suffix[2] || 10;
  const significant_digits = split_suffix[3] || 5;

  return rand.generateGaussians({n, mean, standardDeviation: standard_deviation, significantDigits: significant_digits})
    .then(R.path(['random', 'data']))
    .then(R.join(', '));
}

function integer(client, evt, suffix, lang) {
  if (!nconf.get('RANDOM_KEY')) return Promise.resolve(T('random_setup', lang));
  if (!suffix) return Promise.resolve(T('integer_usage', lang));

  const split_suffix = suffix.split(' ');
  const n = split_suffix[0] || 2;
  const min = split_suffix[1] || 1;
  const max = split_suffix[2] || 50;
  const replacement = suffix.indexOf('replace') === -1;

  return rand.generateIntegers({n, min, max, replacement})
    .then(R.path(['random', 'data']))
    .then(R.join(', '));
}

function string(client, evt, suffix, lang) {
  if (!nconf.get('RANDOM_KEY')) return Promise.resolve(T('random_setup', lang));
  if (!suffix) return Promise.resolve(T('string_usage', lang));

  const split_suffix = suffix.split(' ');
  const n = split_suffix[0] || 1;
  const length = split_suffix[1] || 10;
  const characters = split_suffix[2] || 'abcdefghijklmnopqrstuvwxyz';
  const replacement = suffix.indexOf('replace') === -1;

  return rand.generateStrings({n, length, characters, replacement})
    .then(R.path(['random', 'data']))
    .then(R.join(', '));
}

function random(client, evt, suffix, lang) {
  const split_suffix = suffix.split(' ');
  const cmd = split_suffix[0];
  split_suffix.shift();
  suffix = split_suffix.join(' ');

  if (cmd === 'fraction') return fraction(client, evt, suffix, lang);
  if (cmd === 'gaussian') return gaussian(client, evt, suffix, lang);
  if (cmd === 'integer') return integer(client, evt, suffix, lang);
  if (cmd === 'string') return string(client, evt, suffix, lang);
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
    prefix: false,
    subcommands: [
      {
        name: 'fraction',
        parameters: ['amount', 'decimal places']
      },
      {
        name: 'gaussian',
        parameters: ['amount', 'mean', 'deviation', 'significant digits']
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
