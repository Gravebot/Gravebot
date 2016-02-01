import Promise from 'bluebird';
import _request from 'request';
import R from 'ramda';

import sentry from '../config/sentry';


const request = Promise.promisify(_request);

function cat(bot, msg) {
  let options = {
    url: `http://random.cat/meow.php`,
    json: true
  };

  request(options)
    .then(R.path(['body', 'file']))
    .then(text => bot.sendMessage(msg.channel, encodeURI(text)))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function pug(bot, msg) {
  let options = {
    url: `https://pugme.herokuapp.com/bomb?count=1`,
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
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function pugbomb(bot, msg, suffix) {
  suffix = Number(suffix) || 5;
  if (suffix > 10) suffix = 10;

  let options = {
    url: `https://pugme.herokuapp.com/bomb?count=${suffix}`,
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
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  cat,
  cats: cat,
  pug,
  pugbomb,
  pugs: pug
};
