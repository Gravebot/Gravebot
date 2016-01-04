import Promise from 'bluebird';
import nconf from 'nconf';
import _request from 'request';
import R from 'ramda';

const request = Promise.promisify(_request);

function yoda(bot, msg, phrase) {
  if (!nconf.get('MASHAPE_KEY')) {
    return bot.sendMessage(msg.channel, 'Please setup Mashape to use the `!yoda` command.');
  }

  let options = {
    url: 'https://yoda.p.mashape.com/yoda',
    qs: {sentence: phrase},
    headers: {
      Accept: 'text/plain',
      'X-Mashape-Key': nconf.get('MASHAPE_KEY')
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
