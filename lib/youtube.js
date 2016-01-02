import YoutubeNode from 'youtube-node';
import CONFIG from '../config';

const youtube = new YoutubeNode();
youtube.setKey(CONFIG.youtube_api_key);

function search(query, channel, bot) {
  youtube.search(query, 1, function(err, result) {
    if (err) console.log(err);
    if (!result || !result.items || result.items.length < 1) {
      bot.sendMessage(channel, `I couldn't find a video for: ${query}`);
    } else {
      bot.sendMessage(channel, `http://www.youtube.com/watch?v=${result.items[0].id.videoId}`);
    }
  });
}

export default {
  youtube: (bot, msg, suffix) => {
    if (!CONFIG.youtube_api_key) {
      bot.sendMessage(msg.channel, 'Please setup Youtube in order to use the **`!youtube`** command.');
      return;
    }
    if (!suffix) {
      bot.sendMessage(msg.channel, 'Usage: **`!youtube`** `video tags`');
      return;
    }
    search(suffix, msg.channel, bot);
  }
};
