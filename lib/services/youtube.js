import YoutubeNode from 'youtube-node';
import CONFIG from '../../config';

export default class Youtube {
  constructor() {
    this.youtube = new YoutubeNode();
    this.youtube.setKey(CONFIG.youtube_api_key);
  }

  respond(query, channel, bot) {
    this.youtube.search(query, 1, function(err, result) {
      if (err) console.log(err);
      if (!result || !result.items || result.items.length < 1) {
        bot.sendMessage(channel, "I couldn't find a video for: " + query);
      } else {
        bot.sendMessage(channel, `http://www.youtube.com/watch?v=result.items[0].id.videoId`);
      }
    });
  }
}
