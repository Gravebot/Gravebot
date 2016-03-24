import Imgflipper from 'imgflipper';
import nconf from 'nconf';

import sentry from '../../sentry';
import T from '../../translate';

import { memes } from '../../data';


const imgflipper = new Imgflipper(nconf.get('IMGFLIP_USERNAME'), nconf.get('IMGFLIP_PASSWORD'));

function meme(bot, msg, suffix) {
  if (!nconf.get('IMGFLIP_USERNAME') || !nconf.get('IMGFLIP_PASSWORD')) {
    bot.sendMessage(msg.channel, T('meme_setup', msg.author.lang));
    return;
  }

  if (!suffix) {
    bot.sendMessage(msg.channel, T('meme_usage', msg.author.lang));
    return;
  }
  const tags = suffix.split('"');
  const memetype = tags[0].trim();

  // Still send blank meme, but also send usage message.
  if (!tags[1] && !tags[3]) bot.sendMessage(msg.channel, T('meme_usage', msg.author.lang));

  imgflipper.generateMeme(memes[memetype], tags[1] ? tags[1] : ' ', tags[3] ? tags[3] : ' ', (err, image) => {
    if (err) {
      if (err.message !== 'No texts supplied') sentry(err, 'meme');
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    } else {
      bot.sendMessage(msg.channel, image);
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
