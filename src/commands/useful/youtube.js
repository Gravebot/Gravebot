import nconf from 'nconf';
import YoutubeNode from 'youtube-node';

import T from '../../translate';


const youtube = new YoutubeNode();
youtube.setKey(nconf.get('YOUTUBE_API_KEY'));
youtube.addParam('type', 'video,playlist');

function search(bot, msg, suffix) {
  if (!nconf.get('YOUTUBE_API_KEY')) {
    bot.sendMessage(msg.channel, T('youtube_setup', msg.author.lang));
    return;
  }

  if (!suffix) {
    bot.sendMessage(msg.channel, T('youtube_usage', msg.author.lang));
    return;
  }

  youtube.search(suffix, 1, (err, result) => {
    if (err) console.log(err);
    if (!result || !result.items || result.items.length < 1) {
      bot.sendMessage(msg.channel, `${T('youtube_error', msg.author.lang)}: ${suffix}`);
    } else {
      const id_obj = result.items[0].id;
      if (id_obj.playlistId) return bot.sendMessage(msg.channel, `https://www.youtube.com/playlist?list=${id_obj.playlistId}`);
      bot.sendMessage(msg.channel, `http://www.youtube.com/watch?v=${id_obj.videoId}`);
    }
  });
}

export default {
  youtube: search,
  yt: search
};

export const help = {
  youtube: {parameters: ['search terms']}
};
