import Promise from 'bluebird';

import T from '../../translate';

const request = Promise.promisify(require('request'));


function ddg(client, evt, suffix, lang) {
  let bang = suffix.split(' ')[0];
  let query = suffix.split(' ')[1];
  if (bang[0] !== '!') {
    bang = '';
    query = suffix.split(' ')[0];
  }
  if (!suffix) return Promise.resolve(T('ddg_usage', lang));

  const options = {
    method: 'GET',
    url: 'http://api.duckduckgo.com/',
    qs: {
      q: `${bang} ${query}`,
      format: 'json',
      pretty: '0',
      no_redirects: '1',
      no_html: '0',
      skip_disambig: '0',
      t: 'Gravebot - Discord Bot'
    }
  };

  request(options, (error, response, body) => {
    if (!body.length) return Promise.resolve(`${T('ddg_error', lang)}: ${suffix}`);
    if (error) throw new Error(error);
    console.log(body.Redirect);
  });
}

export default {
  bang: ddg,
  ddg,
  duck: ddg,
  duckduckgo: ddg
};

export const help = {
  ddg: {parameters: ['text']}
};
