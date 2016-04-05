import Promise from 'bluebird';
import nconf from 'nconf';
import _request from 'request';
import R from 'ramda';

import sentry from '../../sentry';
import T from '../../translate';


const request = Promise.promisify(_request);

function giphy(client, e, suffix) {
  if (!suffix) {
    e.message.channel.sendMessage(T('giphy_usage', e.message.author.lang));
    return;
  }

  // limit=1 will only return 1 gif
  const options = {
    url: 'http://api.giphy.com/v1/gifs/random?tag=' + encodeURI(suffix),
    qs: {
      api_key: 'dc6zaTOxFJmzC',
      rating: 'r',
      format: 'json',
      limit: 1
    },
    json: true
  };

  request(options)
    .then(R.prop('body'))
    .then(body => {
      if (body.data.id) {
        e.message.channel.sendMessage(body.data.image_original_url);
      } else {
        e.message.channel.sendMessage(`${T('gif_error', e.message.author.lang)}: ${suffix}`);
      }
    })
    .catch(err => {
      sentry(err, 'gif', 'giphy');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

function popkey(client, e, suffix) {
  if (!nconf.get('POPKEY_KEY')) {
    e.message.channel.sendMessage(T('popkey_setup', e.message.author.lang));
    return;
  }

  if (!suffix) {
    e.message.channel.sendMessage(T('popkey_usage', e.message.author.lang));
    return;
  }

  const options = {
    url: 'http://api.popkey.co/v2/media/search?q=' + encodeURI(suffix),
    headers: {
      Authorization: 'Basic ' + nconf.get('POPKEY_KEY'),
      Accept: 'application/json'
    }
  };

  request(options)
    .then(R.prop('body'))
    .then(JSON.parse)
    .then(body => {
      if (body[0].id) {
        const gif = body[Math.floor(Math.random() * body.length)].source.url;
        e.message.channel.sendMessage(gif);
      } else {
        e.message.channel.sendMessage(`${T('gif_error', e.message.author.lang)}: ${suffix}`);
      }
    })
    .catch(err => {
      if (err instanceof TypeError) {
        e.message.channel.sendMessage(`${T('gif_error', e.message.author.lang)}: ${suffix}`);
      } else {
        sentry(err, 'gif', 'popkey');
        e.message.channel.sendMessage(`Error: ${err.message}`);
      }
    });
}

function gif(client, e, suffix) {
  if (!suffix) {
    e.message.channel.sendMessage(T('gif_usage', e.message.author.lang));
    return;
  }

  const number = Math.floor(Math.random() * 2) + 1;
  if (number === 1) {
    popkey(client, e, suffix);
  } else {
    giphy(client, e, suffix);
  }
}

export default {
  gif,
  giphy,
  popkey
};

export const help = {
  gif: {parameters: 'gif tags'}
};
