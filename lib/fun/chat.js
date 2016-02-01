import Cleverbot from 'cleverbot-node';
import ent from 'entities';
import nconf from 'nconf';

import sentry from '../config/sentry';


const clever = new Cleverbot(nconf.get('CLEVERBOT_API_NAME'), nconf.get('CLEVERBOT_API_KEY'));

function chat(bot, msg, suffix) {
  if (!nconf.get('CLEVERBOT_API_NAME') || !nconf.get('CLEVERBOT_API_KEY')) {
    bot.sendMessage(msg.channel, 'Please setup cleverbot in config.js to use the **`!chat`** command.');
    return;
  }

  if (!suffix) suffix = 'Hello.';

  bot.startTyping(msg.channel);
  Cleverbot.prepare(() => {
    try {
      clever.write(suffix, (response) => {
        if (/\|/g.test(response.message)) {
          response.message = response.message.replace(/\|/g, '\\u');
          response.message = response.message.replace(/\\u([\d\w]{4})/gi, (match, grp) => {
            return String.fromCharCode(parseInt(grp, 16));
          });
        }
        bot.sendMessage(msg, ent.decodeHTML(response.message));
      });
    } catch (error) {
      sentry.captureError(error);
      bot.sendMessage(msg.channel, `Error: ${error.message}`);
    }
  });
  bot.stopTyping(msg.channel);
}

export default {
  chat
};
