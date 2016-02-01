import Promise from 'bluebird';
import nconf from 'nconf';
import _request from 'request';
import R from 'ramda';

import sentry from '../config/sentry';


const request = Promise.promisify(_request);

function giphy(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, 'Usage: **`!giphy`** `gif tags`');
    return;
  }

  // limit=1 will only return 1 gif
  let options = {
    url: 'http://api.giphy.com/v1/gifs/random?tag=' + encodeURI(suffix),
    qs: {
      api_key: 'dc6zaTOxFJmzC',
      rating: 'r',
      format: 'json',
      limit: 1
    },
    json: true
  };

  request(options)
    .then(R.prop('body'))
    .then(body => {
      if (body.data.id) {
        bot.sendMessage(msg.channel, body.data.image_original_url);
      } else {
        bot.sendMessage(msg.channel, `I couldn\'t find a gif for: ${suffix}`);
      }
    })
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function popkey(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, 'Usage: **`!popkey`** `gif tags`');
    return;
  }

  let options = {
    url: 'http://api.popkey.co/v2/media/search?q=' + encodeURI(suffix),
    headers: {
      Authorization: 'Basic ' + nconf.get('POPKEY_KEY'),
      Accept: 'application/json'
    }
  };

  request(options)
    .then(R.prop('body'))
    .then(JSON.parse)
    .then(body => {
      if (body) {
        const gif = body[Math.floor(Math.random() * body.length)].source.url;
        bot.sendMessage(msg.channel, gif);
      } else {
        bot.sendMessage(msg.channel, `I couldn\'t find a gif for: ${suffix}`);
      }
    })
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function gif(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, 'Usage: **`!gif`** `gif tags`');
    return;
  }

  let number = Math.floor(Math.random() * 2) + 1;
  if (number === 1) {
    popkey(bot, msg, suffix);
  } else {
    giphy(bot, msg, suffix);
  }
}

export default {
  gif,
  giphy,
  popkey
};
