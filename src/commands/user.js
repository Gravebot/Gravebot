import { PMChannel } from 'discord.js';
import R from 'ramda';

import sentry from '../sentry';
import { setUserLang } from '../redis';
import T, { langs } from '../translate';

const lang_defs = require('../data/lang_defs.json');


function setLang(bot, msg, suffix) {
  let lang = suffix.toLowerCase().trim();

  if (lang_defs[lang]) lang = lang_defs[lang];
  if (!lang || !R.contains(lang, langs)) {
    const lang_options = {};
    R.forEach(key => {
      const lang_code = lang_defs[key];
      if (!lang_options[lang_code]) lang_options[lang_code] = [lang_code];
      lang_options[lang_code].push(key);
    }, R.keys(lang_defs));

    const langs = R.join('\n', R.map(R.join(', '), R.values(lang_options)));
    return bot.sendMessage(msg.channel, `${T('accepted_languages', 'en')}:\n\n**${langs}**`);
  }

  setUserLang(msg.author.id, lang).then(() => {
    if (msg.channel instanceof PMChannel) {
      bot.sendMessage(msg.channel, `${T('hello', lang)}, ${msg.author.name}!`);
    } else {
      bot.sendMessage(msg.channel, `${T('hello', lang)}, ${msg.author}!`);
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

export const help = {
  'set-language': {
    parameters: 'language',
    category: 'help'
  }
};
