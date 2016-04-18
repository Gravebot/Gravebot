import Promise from 'bluebird';
import _request from 'request';
import R from 'ramda';

import { subCommands as helpText } from '../help';

const request = Promise.promisify(_request);

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

  const options = {
    url: `http://pugme.herokuapp.com/bomb?count=${count}`,
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Gravebot'
    },
    json: true
  };

  return request(options)
    .then(R.path(['body', 'pugs']))
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
