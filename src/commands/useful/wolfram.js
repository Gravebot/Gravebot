import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import wolframalpha from 'wolfram-alpha';

import T from '../../translate';


function queryWolf(wolf, query) {
  return new Promise((resolve, reject) => {
    wolf.query(query, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
}

function wolfram(client, evt, query, lang) {
  if (!nconf.get('WOLFRAM_KEY')) return Promise.resolve(T('wolfram_setup', lang));
  if (!query) return Promise.resolve(T('wolfram_usage', lang));

  const wolf = wolframalpha.createClient(nconf.get('WOLFRAM_KEY'));
  return queryWolf(wolf, query)
    .then(R.nth(1))
    .tap(data => {
      if (!data) throw new Error('No results found');
    })
    .then(R.prop('subpods'))
    .then(R.nth(0))
    .then(R.prop('image'));
}

export default {
  wfa: wolfram,
  wolfram
};

export const help = {
  wolfram: {parameters: ['query']}
};
