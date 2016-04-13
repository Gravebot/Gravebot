import Cleverbot from 'cleverbot-node';
import ent from 'entities';
import nconf from 'nconf';

import sentry from '../../sentry';
import T from '../../translate';


const clever = new Cleverbot(nconf.get('CLEVERBOT_API_NAME'), nconf.get('CLEVERBOT_API_KEY'));

function chat(client, e, suffix, lang) {
  if (!nconf.get('CLEVERBOT_API_NAME') || !nconf.get('CLEVERBOT_API_KEY')) {
    e.message.channel.sendMessage(T('chat_setup', lang));
    return;
  }

  if (!suffix) suffix = 'Hello.';

  Cleverbot.prepare(() => {
    try {
      clever.write(suffix, (response) => {
        if (/\|/g.test(response.message)) {
          response.message = response.message.replace(/\|/g, '\\u');
          response.message = response.message.replace(/\\u([\d\w]{4})/gi, (match, grp) => {
            return String.fromCharCode(parseInt(grp, 16));
          });
        }
        e.message.channel.sendMessage(ent.decodeHTML(response.message));
      });
    } catch (err) {
      sentry(err, 'chat');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    }
  });
}

export default {
  chat
};

export const help = {
  chat: {
    parameters: ['text']
  }
};
