import Promise from 'bluebird';
import didyoumean from 'didyoumean';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';
import SuperError from 'super-error';

const request = Promise.promisify(_request);

// Setup and makes request to e621 API
// Requires you to set a User-Agent.
function _makeRequest(options) {
  let default_options = {
    json: true,
    headers: {
      'User-Agent' : 'FurBot/1.0 (Phun @ e621)'
    }
  };

  if (options.qs) options.qs = R.merge(default_options.qs, options.qs);
  return request(R.merge(default_options, options, true))
    .tap(res => {
      if (res.statusCode === 521) throw new ApiDown();
    })
    .then(R.prop('body'))
    .tap(body => {
      if (body.error) throw new Error(body.error);
    });
}

function latest(suffix) {
  const query = suffix.toLowerCase().replace('latest ', '');
  if (query == '') return Promise.resolve(`No tags were supplied :warning:`);
  const options = {
    url: `https://e621.net/post/index.json?tags=${query}`,
    qs: {
      limit: 1
    }
  };

  return _makeRequest(options)
    .then(body => {
      let id = R.pluck('id')(body);
      let file = R.pluck('file_url')(body);
      let artist = R.pluck('artist')(body);
      let height = R.pluck('height')(body);
      let width = R.pluck('width')(body);
      let score = R.pluck('score')(body);
      let faves = R.pluck('fav_count')(body);
      let title = `This is the latest image on e621 for: **${query}**`;
      let reply = R.join('\n', R.prepend(title, file));
      let data = (`\n\`ID: ${id}\` \`Artist: ${artist}\` \`Resolution: ${width} x ${height}\` \`Score: ${score}\` \`Favorites: ${faves}\``);
      let output = R.join('', R.prepend(reply, data));
      return output
    })
}

function tags(suffix) {
  const query = suffix.toLowerCase().replace('tags ', '');
  if (query == '') return Promise.resolve(`No tags were supplied :warning:`);
  const options = {
    url: `https://e621.net/post/index.json?tags=${query}`,
    qs: {
      limit: 100
    }
  };
  return _makeRequest(options)
    .then(body => {
      if (body.length == 0) return Promise.resolve(`No results for: \`${query}\` :warning:`);
      // Do some math
      let randomid = Math.floor(Math.random() * body.length);
      // Grab the data
      let id = body[randomid].id;
      let file = body[randomid].file_url;
      let artist = body[randomid].artist;
      let height = body[randomid].height;
      let width = body[randomid].width;
      let score = body[randomid].score;
      let faves = body[randomid].fav_count;
      // Put it all together for output
      let title = `Here\'s an image from e621 for: **${query}**\n`;
      let reply = R.join('', R.prepend(title, file));
      let data = (`\n\`ID: ${id}\` \`Artist: ${artist}\` \`Resolution: ${width} x ${height}\` \`Score: ${score}\` \`Favorites: ${faves}\``);
      let output = R.join('', R.prepend(reply, data));
      return output
    })
}

export default {
  e6: (client, evt, suffix, lang) => {
    const command = suffix.toLowerCase().split(' ')[0];

    if (command === 'latest') return latest(suffix);
    if (command === 'tags') return tags(suffix);
    if (command !== 'tags' || command !== 'latest') return tags(suffix);
  }
};
