import Promise from 'bluebird';
import _request from 'request';
import R from 'ramda';

const request = Promise.promisify(_request);

function giphy(bot, msg, tags) {
  // limit=1 will only return 1 gif
  let options = {
    url: 'http://api.giphy.com/v1/gifs/search',
    qs: {
      api_key: 'dc6zaTOxFJmzC',
      rating: 'r',
      format: 'json',
      limit: 1
    },
    json: true
  };
  if (tags) options.qs.q = tags.join('+');

  request(options)
    .then(R.prop('body'))
    .then(body => {
      if (body.data.length) {
        bot.sendMessage(msg.channel, `http://media.giphy.com/media/${body.data[0].id}/giphy.gif`);
      } else {
        bot.sendMessage(msg.channel, `I couldn\'t find a gif for: ${tags}`);
      }
    })
    .catch(err => bot.sendMessage(msg.channel, `Error: ${err.message}`));
}

export default {
  gif: (bot, msg, suffix) => {
    if (!suffix) {
      bot.sendMessage(msg.channel, 'Usage: **`!gif`** `gif tags`');
      return;
    }
    let tags = suffix.split(' ');
    giphy(bot, msg, tags);
  }
};
