import Promise from 'bluebird';
import R from 'ramda';

import { subCommands as helpText } from '../help';
import pug_urls from '../../data/pugs.json';

const request = Promise.promisify(require('request'));


function cat(client, evt, suffix) {
  let count = 1;
  if (suffix && suffix.split(' ')[0] === 'bomb') {
    count = Number(suffix.split(' ')[1]) || 5;
    if (count > 15) count = 15;
    if (count < 0) count = 5;
  }

  const options = {
    url: 'http://random.cat/meow.php',
    json: true
  };

  return Promise.resolve(R.repeat('cat', count))
    .map(() => {
      return request(options)
        .then(R.path(['body', 'file']))
        .then(encodeURI);
    })
    .then(R.join('\n'));
}

function pug(client, evt, suffix) {
  let count = 1;
  if (suffix && suffix.split(' ')[0] === 'bomb') {
    count = Number(suffix.split(' ')[1]) || 5;
    if (count > 15) count = 15;
    if (count < 0) count = 5;
  }

  return Promise.map(R.range(0, count), () => pug_urls[Math.floor(Math.random() * pug_urls.length)])
    .then(R.join('\n'));
}

function snake(client, evt, suffix) {
  let count = 1;
  if (suffix && suffix.split(' ')[0] === 'bomb') {
    count = Number(suffix.split(' ')[1]) || 5;
    if (count > 15) count = 15;
    if (count < 0) count = 5;
  }

  const options = {
    url: 'http://fur.im/snek/snek.php',
    json: true
  };

  return Promise.resolve(R.repeat('snake', count))
    .map(() => {
      return request(options)
        .then(R.path(['body', 'file']))
        .then(encodeURI);
    })
    .then(R.join('\n'));
}

function animals(client, evt, suffix, lang) {
  const split_suffix = suffix.split(' ');
  const cmd = split_suffix[0];
  split_suffix.shift();
  suffix = split_suffix.join(' ');

  if (cmd === 'cat') return cat(client, evt, suffix);
  if (cmd === 'pug') return pug(client, evt, suffix);
  if (cmd === 'snake') return snake(client, evt, suffix);
  return helpText(client, evt, 'animals', lang);
}

export default {
  animal: animals,
  animals,
  cat,
  cats: cat,
  '\ud83d\udc31': cat,
  pug,
  pugs: pug,
  snake,
  snakes: snake,
  snek: snake,
  sneks: snake,
  '\ud83d\udc0d': snake
};

export const help = {
  animals: {
    prefix: false,
    header_text: 'animals_header_text',
    subcommands: [
      {name: 'cat'},
      {name: 'pug'},
      {name: 'snake'}
    ]
  }
};
