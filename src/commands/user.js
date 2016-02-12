import { PMChannel } from 'discord.js';

import sentry from '../sentry';
import { setUserLang } from '../redis';
import T from '../translate';


function setLang(bot, msg, suffix) {
  const lang = suffix.toLowerCase();
  setUserLang(msg.author.id, lang).then(() => {
    if (msg.channel instanceof PMChannel) {
      bot.sendMessage(msg.channel, `${T('hello', lang)}, ${msg.author.name}!`);
    } else {
      bot.sendMessage(msg.channel, `${T('hello', lang)}, @${msg.author.name}!`);
    }
  })
  .catch(err => {
    sentry(err, 'user', 'setlang');
    bot.sendMessage(msg.channel, `Error: ${err.message}`);
  });
}

export default {
  setlang: setLang,
  'set-language': setLang
};
