import Promise from 'bluebird';
import cheerio from 'cheerio';
import gizoogle from 'gizoogle';
import _request from 'request';
import R from 'ramda';

import sentry from '../config/sentry';


const request = Promise.promisify(_request);

function snoop(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, 'Usage: **`!snoopify`** `sentence`');
    return;
  }
  gizoogle.string(suffix, (err, translation) => {
    if (err) sentry.captureError(err);
    bot.sendMessage(msg.channel, translation);
  });
}

function yoda(bot, msg, phrase) {
  if (!phrase) {
    bot.sendMessage(msg.channel, 'Usage: **`!yoda`** `sentence`');
    return;
  }

  let options = {
    url: 'http://www.yodaspeak.co.uk/index.php',
    method: 'POST',
    form: {
      YodaMe: phrase,
      go: 'Convert to Yoda-Speak!'
    }
  };

  request(options)
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('textarea[name="YodaSpeak"]').first().text())
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  snoop,
  snoopify: snoop,
  yoda: yoda,
  yodaify: yoda
};
