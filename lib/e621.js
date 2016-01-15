import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';

import sentry from './config/sentry';

const request = Promise.promisify(_request);

const help_text = `e621 help commands
Multiple tags can be comma seperated.

**\`!e6 tags\`** \`tag(s)\`
    Get a random image for your given tag(s).
**\`!e6 latest\`** \`tag(s)\`
    Get the latest image for your given tag(s).
**\`!e6 random\`**
    Roll for a completely random image. May be NSFW!`;

function _makeRequest(options) {
  let default_options = {
    json: true
  };
  if (options.qs) options.qs = R.merge(default_options.qs, options.qs);
  return request(R.merge(default_options, options, true))
    .then(R.prop('body'))
    .tap(body => {
      if (body.error) throw new Error(body.error);
    });
}

function random(bot, msg) {
  let rand;
  function getRandom() {
    let options = {
      url: `https://e621.net/post/index.json`,
      qs: {
        limit: 1,
        page: 1
      }
    };
    return _makeRequest(options)
      .then(body => {
        let randid = R.pluck('id')(body);
        if (R.isEmpty(body)) throw new Error(`Couldn't get random image.`);
        rand = Math.floor(Math.random() * randid);
      })
      .catch(err => {
        sentry.captureError(err);
        bot.sendMessage(msg.channel, `Error: ${err.message}`);
      });
  }
  getRandom().then(outputRandom => {
    let optionstwo = {
      url: `https://e621.net/post/show/${rand}.json`
    };
    return _makeRequest(optionstwo)
      .then(buddy => {
        if (R.isEmpty(buddy)) throw new Error(`Couldn't get random image.`);
        let id = buddy.id;
        let file = buddy.file_url;
        if (file === "/images/deleted-preview.png") throw new Error(`The random image you rolled was a deleted file.`);
        let artist = buddy.artist;
        let height = buddy.height;
        let width = buddy.width;
        let score = buddy.score;
        let faves = buddy.fav_count;
        let title = `Here's a random image from e621, enjoy:\n`;
        let reply = R.join('', R.prepend(title, file));
        let data = (`\n\`ID: ${id}\` \`Artist: ${artist}\` \`Resolution: ${height} x ${width}\` \`Score: ${score}\` \`Favorites: ${faves}\``);
        let output = R.join('', R.prepend(reply, data));
        bot.sendMessage(msg.channel, output);
      })
      .catch(err => {
        sentry.captureError(err);
        bot.sendMessage(msg.channel, `Error: ${err.message}`);
      });
  })
}

function latest(bot, msg, suffix) {
  let query = suffix.toLowerCase().replace('latest ', '');
  if (query === "latest") return bot.sendMessage(msg.channel, 'You didn\'t specify any tags.');
  let options = {
    url: `https://e621.net/post/index.json?tags=${query}`,
    qs: {
      limit: 1
    }
  };
  return _makeRequest(options)
    .then(body => {
      let file = R.pluck('file_url')(body);
      if (R.isEmpty(body)) throw new Error(`No image found for: **${query}**. Did you use the right tags?`);
      let id = R.pluck('id')(body);
      let artist = R.pluck('artist')(body);
      let height = R.pluck('height')(body);
      let width = R.pluck('width')(body);
      let score = R.pluck('score')(body);
      let faves = R.pluck('fav_count')(body);
      let title = `This is the latest image on e621 for: **${query}**`;
      let reply = R.join('\n', R.prepend(title, file));
      let data = (`\n\`ID: ${id}\` \`Artist: ${artist}\` \`Resolution: ${height} x ${width}\` \`Score: ${score}\` \`Favorites: ${faves}\``);
      let output = R.join('', R.prepend(reply, data));
      bot.sendMessage(msg.channel, output);
    })
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function tags(bot, msg, suffix) {
  let query = suffix.toLowerCase().replace('tags ', '');
  if (query === "tags") return bot.sendMessage(msg.channel, 'You didn\'t specify any tags.');
  let rand;
  function getRandom() {
    let options = {
      url: `https://e621.net/post/index.json?tags=${query}`,
      qs: {
        limit: 100
      }
    };
    return _makeRequest(options)
      .then(body => {
        let idlist = R.pluck('id')(body);
        let randid = Math.floor(Math.random() * idlist.length);
        rand = idlist[randid];
      })
      .catch(err => {
        sentry.captureError(err);
        bot.sendMessage(msg.channel, `Error: ${err.message}`);
      });
  }
  getRandom().then(outputRandom => {
    let optionstwo = {
      url: `https://e621.net/post/show/${rand}.json`
    };
    if (typeof rand == 'undefined')
    return bot.sendMessage(msg.channel, `No image found for: **${query}**. Did you use the right tags?`);
    else
    return _makeRequest(optionstwo)
      .then(buddy => {
        if (R.isEmpty(buddy)) throw new Error(`No image found for: **${query}**.`);
        let id = buddy.id;
        let file = buddy.file_url;
        if (file === "/images/deleted-preview.png") throw new Error(`The random image you rolled was a deleted file.`);
        let artist = buddy.artist;
        let height = buddy.height;
        let width = buddy.width;
        let score = buddy.score;
        let faves = buddy.fav_count;
        let title = `Here's an image from e621 with the tags: **${query}**\n`;
        let reply = R.join('', R.prepend(title, file));
        let data = (`\n\`ID: ${id}\` \`Artist: ${artist}\` \`Resolution: ${height} x ${width}\` \`Score: ${score}\` \`Favorites: ${faves}\``);
        let output = R.join('', R.prepend(reply, data));
        bot.sendMessage(msg.channel, output);
      })
      .catch(err => {
        sentry.captureError(err);
        bot.sendMessage(msg.channel, `Error: ${err.message}`);
      });
  })
}

export default {
  e6: (bot, msg, suffix) => {
    let command = suffix.toLowerCase().split(' ')[0];
    if (command === 'random') return random(bot, msg);
    if (command === 'latest') return latest(bot, msg, suffix);
    if (command === 'tags') return tags(bot, msg, suffix);
    return bot.sendMessage(msg.channel, help_text);
  }
};
