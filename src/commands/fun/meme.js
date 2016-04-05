import Imgflipper from 'imgflipper';
import nconf from 'nconf';

import sentry from '../../sentry';
import T from '../../translate';

import { memes } from '../../data';


const imgflipper = new Imgflipper(nconf.get('IMGFLIP_USERNAME'), nconf.get('IMGFLIP_PASSWORD'));

function meme(client, e, suffix) {
  if (!nconf.get('IMGFLIP_USERNAME') || !nconf.get('IMGFLIP_PASSWORD')) {
    e.message.channel.sendMessage(T('meme_setup', e.message.author.lang));
    return;
  }

  if (!suffix) {
    e.message.channel.sendMessage(T('meme_usage', e.message.author.lang));
    return;
  }
  const tags = suffix.split('"');
  const memetype = tags[0].trim();

  // Still send blank meme, but also send usage message.
  if (!tags[1] && !tags[3]) e.message.channel.sendMessage(T('meme_usage', e.message.author.lang));

  imgflipper.generateMeme(memes[memetype], tags[1] ? tags[1] : ' ', tags[3] ? tags[3] : ' ', (err, image) => {
    if (err) {
      if (err.message !== 'No texts supplied') sentry(err, 'meme');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    } else {
      e.message.channel.sendMessage(image);
    }
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
