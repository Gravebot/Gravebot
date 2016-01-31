import Imgflipper from 'imgflipper';
import nconf from 'nconf';

import sentry from './config/sentry';

import { memes } from '../data';


const imgflipper = new Imgflipper(nconf.get('IMGFLIP_USERNAME'), nconf.get('IMGFLIP_PASSWORD'));

function meme(bot, msg, suffix) {
  if (!nconf.get('IMGFLIP_USERNAME') || !nconf.get('IMGFLIP_PASSWORD')) {
    bot.sendMessage(msg.channel, 'Please setup imgflip in config.js to use the **`!meme`** command.');
    return;
  }

  let usage_message = 'Usage: **`!meme`** `meme name` `"top text"` `"bottom text"`\nWrite **`!memelist`** for a list of meme names.';
  if (!suffix) {
    bot.sendMessage(msg.channel, usage_message);
    return;
  }
  let tags = suffix.split('"');
  let memetype = tags[0].trim();

  // Still send blank meme, but also send usage message.
  if (!tags[1] && !tags[3]) bot.sendMessage(msg.channel, usage_message);

  imgflipper.generateMeme(memes[memetype], tags[1] ? tags[1] : ' ', tags[3] ? tags[3] : ' ', (err, image) => {
    if (err) {
      if (err.message !== 'No texts supplied') sentry.captureError(err);
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
