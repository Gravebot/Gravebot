import Cleverbot from 'cleverbot.io';
import nconf from 'nconf';

import sentry from '../config/sentry';


const clever = new Cleverbot(nconf.get('CLEVERBOT_API_NAME'), nconf.get('CLEVERBOT_API_KEY'));
clever.setNick('Gravebot');

function chat(bot, msg, suffix) {
  if (!nconf.get('CLEVERBOT_API_NAME') || !nconf.get('CLEVERBOT_API_KEY')) {
    bot.sendMessage(msg.channel, 'Please setup cleverbot in config.js to use the **`!chat`** command.');
    return;
  }

  if (!suffix) suffix = 'Hello.';

  clever.create((err, session) => {
    if (err) sentry.captureError(err);
    clever.ask(suffix, (err, response) => {
      if (err) sentry.captureError(err);
      bot.sendMessage(msg.channel, response);
    });
  });
}

export default {
  chat
};
