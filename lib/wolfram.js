import Promise from 'bluebird';
import R from 'ramda';
import wolframalpha from 'wolfram-alpha';
import CONFIG from '../config';

const wolf = wolframalpha.createClient(CONFIG.wolfram_api);
function queryWolf(query) {
  return new Promise((resolve, reject) => {
    wolf.query(query, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
}


function wolfram(bot, msg, query) {
  if (!CONFIG.wolfram_api) {
    return bot.sendMessage(msg.channel, 'Please setup Wolfram to use the `!wolfram` command.');
  }

  queryWolf(query)
    .tap(console.log)
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
  wolfram: wolfram
};
