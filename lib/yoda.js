import Promise from 'bluebird';
import cheerio from 'cheerio';
import _request from 'request';
import R from 'ramda';


const request = Promise.promisify(_request);

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
    .catch(err => bot.sendMessage(msg.channel, `Error: ${err.message}`));
}

export default {
  yoda: yoda
};
