import Promise from 'bluebird';
import nconf from 'nconf';
import YoutubeNode from 'youtube-node';

import T from '../../translate';


const youtube = new YoutubeNode();
youtube.setKey(nconf.get('YOUTUBE_KEY'));
youtube.addParam('type', 'video,playlist');
const searchYoutube = Promise.promisify(youtube.search);

function search(client, evt, suffix, lang) {
  if (!nconf.get('YOUTUBE_KEY')) return Promise.resolve(T('youtube_setup', lang));
  if (!suffix) return Promise.resolve(T('youtube_usage', lang));

  return searchYoutube(suffix, 1)
    .then(result => {
      if (!result || !result.items || result.items.length < 1) return `${T('youtube_error', lang)}: ${suffix}`;
      const id_obj = result.items[0].id;
      if (id_obj.playlistId) return `https://www.youtube.com/playlist?list=${id_obj.playlistId}`;
      return `http://www.youtube.com/watch?v=${id_obj.videoId}`;
    });
}

export default {
  youtube: search,
  yt: search
};

export const help = {
  youtube: {parameters: ['search terms']}
};
