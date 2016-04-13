import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import wolframalpha from 'wolfram-alpha';

import sentry from '../../sentry';
import T from '../../translate';


function queryWolf(wolf, query) {
  return new Promise((resolve, reject) => {
    wolf.query(query, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
}

function wolfram(client, e, query, lang) {
  if (!nconf.get('WOLFRAM_KEY')) {
    return e.message.channel.sendMessage(T('wolfram_setup', lang));
  }

  if (!query) {
    e.message.channel.sendMessage(T('wolfram_usage', lang));
    return;
  }

  const wolf = wolframalpha.createClient(nconf.get('WOLFRAM_KEY'));
  queryWolf(wolf, query)
    .then(R.nth(1))
    .tap(data => {
      if (!data) throw new Error('No results found');
    })
    .then(R.prop('subpods'))
    .then(R.nth(0))
    .then(R.prop('image'))
    .then(text => e.message.channel.sendMessage(text))
    .catch(err => {
      sentry(err, 'wolfram');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

export default {
  wfa: wolfram,
  wolfram
};

export const help = {
  wolfram: {parameters: ['query']}
};
