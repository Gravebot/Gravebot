import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';

import sentry from '../../sentry';
import T from '../../translate';


const request = Promise.promisify(_request);

function makePaste(client, e, paste) {
  if (!nconf.get('PASTEBIN_KEY')) {
    return e.message.channel.sendMessage(T('pastebin_setup', e.message.author.lang));
  }

  if (!paste) {
    e.message.channel.sendMessage(T('pastebin_usage', e.message.author.lang));
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
    .then(text => e.message.channel.sendMessage(text))
    .catch(err => {
      sentry(err, 'pastebin');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

export default {
  paste: makePaste,
  pastebin: makePaste,
  makepaste: makePaste
};

export const help = {
  paste: {parameters: ['text']}
};
