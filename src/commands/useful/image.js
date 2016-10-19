import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';

import T from '../../translate';

const request = Promise.promisify(require('request'));
const r = require('request')

function image(client, evt, suffix, lang) {
  if (!nconf.get('BING_IMAGE_KEY')) return Promise.resolve(T('bing_setup', lang));
  if (!suffix) return Promise.resolve(T('bing_usage', lang));

  const options = {
    method: 'GET',
    url: `https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=${suffix}&count=1&offset=0&mkt=en-us&safeSearch=Moderate`,
    headers: {
      'Ocp-Apim-Subscription-Key': nconf.get('BING_IMAGE_KEY') 
    }
  };

  return request(options)
    .then(R.prop('body'))
    .then(body => JSON.parse(body))
    .then(x => {console.log(x); return x;})
    .then(R.prop('value'))
    .then(R.nth(0))
    .then(R.prop('contentUrl'))
    .then(contentUrl => request(contentUrl))
    .then(R.prop('request'))
    .then(R.prop('uri'))
    .then(R.prop('href'))
}

export default {
  image
};

export const help = {
  image: {parameters: 'image tags'}
};
