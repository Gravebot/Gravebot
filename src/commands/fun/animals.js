import Promise from 'bluebird';
import _request from 'request';
import R from 'ramda';

import { subCommands as helpText } from '../help';
import sentry from '../../sentry';


const request = Promise.promisify(_request);

function cat(client, e, suffix) {
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

  Promise.resolve(R.repeat('cat', count))
    .map(() => {
      return request(options)
        .then(R.path(['body', 'file']))
        .then(encodeURI);
    })
    .then(R.join('\n'))
    .then(text => e.message.channel.sendMessage(text))
    .catch(err => {
      sentry(err, 'images', 'cat');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

function pug(client, e, suffix) {
  let count = 1;
  if (suffix && suffix.split(' ')[0] === 'bomb') {
    count = Number(suffix.split(' ')[1]) || 5;
    if (count > 15) count = 15;
    if (count < 0) count = 5;
  }

  const options = {
    url: `https://pugme.herokuapp.com/bomb?count=${count}`,
    headers: {
      Accept: 'application/json'
    },
    json: true
  };

  request(options)
    .then(R.path(['body', 'pugs']))
    .then(R.join('\n'))
    .then(text => e.message.channel.sendMessage(text))
    .catch(err => {
      sentry(err, 'images', 'pug');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

function snake(client, e, suffix) {
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

  Promise.resolve(R.repeat('snake', count))
    .map(() => {
      return request(options)
        .then(R.path(['body', 'file']))
        .then(encodeURI);
    })
    .then(R.join('\n'))
    .then(text => e.message.channel.sendMessage(text))
    .catch(err => {
      sentry(err, 'images', 'snake');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

function animals(client, e) {
  e.message.channel.sendMessage(helpText(client, e, 'animals'));
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
