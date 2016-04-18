import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';

import T from '../../translate';


const request = Promise.promisify(_request);

function makePaste(client, evt, paste, lang) {
  if (!nconf.get('PASTEBIN_KEY')) return Promise.resolve(T('pastebin_setup', lang));
  if (!paste) return Promise.resolve(T('pastebin_usage', lang));

  const options = {
    url: 'http://pastebin.com/api/api_post.php',
    method: 'POST',
    form: {
      api_option: 'paste',
      api_paste_code: paste,
      api_dev_key: nconf.get('PASTEBIN_KEY')
    }
  };

  return request(options).then(R.prop('body'));
}

export default {
  paste: makePaste,
  pastebin: makePaste,
  makepaste: makePaste
};

export const help = {
  paste: {parameters: ['text']}
};
