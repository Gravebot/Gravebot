import Promise from 'bluebird';
import Imgflipper from 'imgflipper';
import nconf from 'nconf';

import T from '../../translate';
import { memes } from '../../data';


const imgflipper = new Imgflipper(nconf.get('IMGFLIP_USERNAME'), nconf.get('IMGFLIP_PASSWORD'));
const generateMeme = Promise.promisify(imgflipper.generateMeme);

function meme(client, evt, suffix, lang) {
  if (!nconf.get('IMGFLIP_USERNAME') || !nconf.get('IMGFLIP_PASSWORD')) return Promise.resolve(T('meme_setup', lang));
  if (!suffix) return Promise.resolve(T('meme_usage', lang));

  const tags = suffix.split('"');
  const memetype = tags[0].trim().toLowerCase();

  return generateMeme(memes[memetype], tags[1] ? tags[1] : ' ', tags[3] ? tags[3] : ' ')
    .then(image => {
      // Still send blank meme, but also send usage message.
      if (!tags[1] && !tags[3]) return [T('meme_usage', lang), image];
      return image;
    })
    .catch(err => {
      if (err.message !== 'No texts supplied') throw err;
      return `Error: ${err.message}`;
    });
}

export default {
  meme,
  memes: meme
};

export const help = {
  meme: {
    parameters: ['meme', '"top text"', '"bottom text"']
  }
};
