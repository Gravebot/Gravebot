import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';

import T from '../../translate';

const request = Promise.promisify(require('request'));


function giphy(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('giphy_usage', lang));

  // limit=1 will only return 1 gif
  const options = {
    url: `http://api.giphy.com/v1/gifs/random?tag=${encodeURI(suffix)}`,
    qs: {
      api_key: 'dc6zaTOxFJmzC',
      rating: 'r',
      format: 'json',
      limit: 1
    },
    json: true
  };

  return request(options)
    .then(R.prop('body'))
    .then(body => {
      if (body.data.id) return body.data.image_original_url;
      return `${T('gif_error', lang)}: ${suffix}`;
    });
}

function popkey(client, evt, suffix, lang) {
  if (!nconf.get('POPKEY_KEY')) return Promise.resolve(T('popkey_setup', lang));
  if (!suffix) return Promise.resolve(T('popkey_usage', lang));

  const options = {
    url: `http://api.popkey.co/v2/media/search?q=${encodeURI(suffix)}`,
    json: true,
    headers: {
      Authorization: 'Basic ' + nconf.get('POPKEY_KEY'),
      Accept: 'application/json'
    }
  };

  return request(options)
    .then(R.prop('body'))
    .then(body => {
      if (body[0].id) return body[Math.floor(Math.random() * body.length)].source.url;
      return `${T('gif_error', lang)}: ${suffix}`;
    })
    .catch(err => {
      if (err instanceof TypeError) return `${T('gif_error', lang)}: ${suffix}`;
      throw err;
    });
}

function gif(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('gif_usage', lang));

  const number = Math.floor(Math.random() * 2) + 1;
  if (number === 1) return popkey(client, evt, suffix, lang);
  return giphy(client, evt, suffix, lang);
}

export default {
  gif,
  giphy,
  popkey
};

export const help = {
  gif: {parameters: 'gif tags'}
};
