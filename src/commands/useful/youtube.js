import nconf from 'nconf';
import YoutubeNode from 'youtube-node';

import T from '../../translate';


const youtube = new YoutubeNode();
youtube.setKey(nconf.get('YOUTUBE_API_KEY'));
youtube.addParam('type', 'video,playlist');

function search(client, e, suffix) {
  if (!nconf.get('YOUTUBE_API_KEY')) {
    e.message.channel.sendMessage(T('youtube_setup', e.message.author.lang));
    return;
  }

  if (!suffix) {
    e.message.channel.sendMessage(T('youtube_usage', e.message.author.lang));
    return;
  }

  youtube.search(suffix, 1, (err, result) => {
    if (err) console.log(err);
    if (!result || !result.items || result.items.length < 1) {
      e.message.channel.sendMessage(`${T('youtube_error', e.message.author.lang)}: ${suffix}`);
    } else {
      const id_obj = result.items[0].id;
      if (id_obj.playlistId) return e.message.channel.sendMessage(`https://www.youtube.com/playlist?list=${id_obj.playlistId}`);
      e.message.channel.sendMessage(`http://www.youtube.com/watch?v=${id_obj.videoId}`);
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
