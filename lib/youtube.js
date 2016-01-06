import nconf from 'nconf';
import YoutubeNode from 'youtube-node';

const youtube = new YoutubeNode();
youtube.setKey(nconf.get('YOUTUBE_API_KEY'));
youtube.addParam('type', 'video,playlist');

function search(bot, msg, suffix) {
  if (!nconf.get('YOUTUBE_API_KEY')) {
    bot.sendMessage(msg.channel, 'Please setup Youtube in config.js to use the **`!youtube`** command.');
    return;
  }
  if (!suffix) {
    bot.sendMessage(msg.channel, 'Usage: **`!youtube`** `video tags`');
    return;
  }

  youtube.search(suffix, 1, (err, result) => {
    if (err) console.log(err);
    if (!result || !result.items || result.items.length < 1) {
      bot.sendMessage(msg.channel, `I couldn't find a video for: ${suffix}`);
    } else {
      let id_obj = result.items[0].id;
      if (id_obj.playlistId) return bot.sendMessage(msg.channel, `https://www.youtube.com/playlist?list=${id_obj.playlistId}`);
      bot.sendMessage(msg.channel, `http://www.youtube.com/watch?v=${id_obj.videoId}`);
    }
  });
}

export default {
  youtube: search,
  yt: search
};
