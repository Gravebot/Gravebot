import Promise from 'bluebird';
import _request from 'request';
import R from 'ramda';

import sentry from '../../sentry';


const request = Promise.promisify(_request);

function cat(bot, msg, suffix) {
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
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry(err, 'images', 'cat');
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function dog(bot, msg, suffix) {
  let count = 1;
  if (suffix && suffix.split(' ')[0] === 'bomb') {
    count = Number(suffix.split(' ')[1]) || 5;
    if (count > 15) count = 15;
    if (count < 0) count = 5;
  }
  for (let i = 0; i < count; i++) bot.sendFile(msg.channel, 'http://randomdoggiegenerator.com/randomdoggie.php', 'dog.png');
}

function pug(bot, msg, suffix) {
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
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry(err, 'images', 'pug');
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function snake(bot, msg, suffix) {
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
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry(err, 'images', 'snake');
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  cat,
  cats: cat,
  '\ud83d\udc31': cat,
  dog,
  dogs: dog,
  '\ud83d\udc36': dog,
  pug,
  pugs: pug,
  snake,
  snakes: snake,
  snek: snake,
  sneks: snake,
  '\ud83d\udc0d': snake
};

export const help = {
  cat: {
    parameters: ['bomb', 'number']
  },
  dog: {
    parameters: ['bomb', 'number']
  },
  pug: {
    parameters: ['bomb', 'number']
  }
};
