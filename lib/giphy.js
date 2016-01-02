import request from 'request';

function giphy(tags, next) {
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

  request(options, function(err, response, body) {
    if (err) console.log(err);
    if (body.data.length) {
      next(body.data[0].id);
    } else {
      next(null);
    }
  });
}

export default {
  gif: (bot, msg, suffix) => {
    if (!suffix) {
      bot.sendMessage(msg.channel, 'Usage: **`!gif`** `gif tags`');
      return;
    }
    let tags = suffix.split(' ');
    giphy(tags, (id) => {
      if (id) {
        bot.sendMessage(msg.channel, `http://media.giphy.com/media/${id}/giphy.gif`);
      } else {
        bot.sendMessage(msg.channel, `I couldn\'t find a gif for: ${tags}`);
      }
    });
  }
};
