import Promise from 'bluebird';
import _request from 'request';
import R from 'ramda';

import sentry from './config/sentry';

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

export default {
  cat: cat
};
