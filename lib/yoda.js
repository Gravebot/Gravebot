import Promise from 'bluebird';
import _request from 'request';
import R from 'ramda';

import CONFIG from '../config';
const request = Promise.promisify(_request);

function yoda(bot, msg, phrase) {
  if (!CONFIG.mashape_key) {
    return bot.sendMessage(msg.channel, 'Please setup Mashape to use the `!yoda` command.');
  }

  let options = {
    url: 'https://yoda.p.mashape.com/yoda',
    qs: {sentence: phrase},
    headers: {
      Accept: 'text/plain',
      'X-Mashape-Key': CONFIG.mashape_key
    }
  };

  request(options)
    .then(R.prop('body'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => bot.sendMessage(msg.channel, `Error: ${err.message}`));
}

export default {
  yoda: yoda
};
