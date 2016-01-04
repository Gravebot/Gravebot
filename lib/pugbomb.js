import Promise from 'bluebird';
import _request from 'request';
import R from 'ramda';

const request = Promise.promisify(_request);

function pugbomb(bot, msg, count) {
  count = Number(count) || 5;
  if (count > 15) count = 15;

  let options = {
    url: `https://pugme.herokuapp.com/bomb?count=${count}`,
    headers: {
      Accept: 'application/json'
    },
    json: true
  };

  request(options)
    .then(R.path(['body', 'pugs']))
    .then(R.join('\n'))
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => bot.sendMessage(msg.channel, `Error: ${err.message}`));
}

export default {
  pugbomb: pugbomb
};
