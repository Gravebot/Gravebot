import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';

import sentry from '../../sentry';
import T from '../../translate';


const request = Promise.promisify(_request);

function makePaste(bot, msg, paste) {
  if (!nconf.get('PASTEBIN_KEY')) {
    return bot.sendMessage(msg.channel, T('pastebin_setup', msg.author.lang));
  }

  if (!paste) {
    bot.sendMessage(msg.channel, T('pastebin_usage', msg.author.lang));
    return;
  }

  const options = {
    url: 'http://pastebin.com/api/api_post.php',
    method: 'POST',
    form: {
      api_option: 'paste',
      api_paste_code: paste,
      api_dev_key: nconf.get('PASTEBIN_KEY')
    }
  };

  request(options)
    .then(R.prop('body'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry(err, 'pastebin');
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  paste: makePaste,
  pastebin: makePaste,
  makepaste: makePaste
};

export const help = {
  pastebin: {parameters: ['text']}
};
