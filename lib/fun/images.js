import Promise from 'bluebird';
import _request from 'request';
import R from 'ramda';

import sentry from '../config/sentry';


const request = Promise.promisify(_request);

function cat(bot, msg, suffix) {
  let count = 1;
  if (suffix && suffix.split(' ')[0] === 'bomb') {
    count = Number(suffix.split(' ')[1]) || 5;
    if (count > 15) count = 15;
  }

  let options = {
    url: `http://random.cat/meow.php`,
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
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function pug(bot, msg, suffix) {
  let count = 1;
  if (suffix && suffix.split(' ')[0] === 'bomb') {
    count = Number(suffix.split(' ')[1]) || 5;
    if (count > 15) count = 15;
  }

  let options = {
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
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  cat,
  cats: cat,
  pug,
  pugs: pug
};
