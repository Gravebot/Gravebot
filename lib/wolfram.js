import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import wolframalpha from 'wolfram-alpha';


function queryWolf(wolf, query) {
  return new Promise((resolve, reject) => {
    wolf.query(query, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
}

function wolfram(bot, msg, query) {
  if (!nconf.get('WOLFRAM_KEY')) {
    return bot.sendMessage(msg.channel, 'Please setup Wolfram in config.js to use the **`!wolfram`** command.');
  }

  if (!query) {
    bot.sendMessage(msg.channel, 'Usage: !wolfram query');
  }

  let wolf = wolframalpha.createClient(nconf.get('WOLFRAM_KEY'));
  queryWolf(wolf, query)
    .then(R.nth(1))
    .tap(data => {
      if (!data) throw new Error('No results found');
    })
    .then(R.prop('subpods'))
    .then(R.nth(0))
    .then(R.prop('image'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => bot.sendMessage(msg.channel, `Error: ${err.message}`));
}

export default {
  wolfram: wolfram,
  wfa: wolfram
};
