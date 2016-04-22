import R from 'ramda';

import { setUserLang } from '../redis';
import T, { langs } from '../translate';

const lang_defs = require('../data/lang_defs.json');


function setLang(client, evt, suffix) {
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
    return evt.message.channel.sendMessage(`${T('accepted_languages', 'en')}:\n\n**${langs}**`);
  }

  return setUserLang(evt.message.author.id, lang)
    .then(() => `${T('hello', lang)}!`);
}

export default {
  lang: setLang,
  language: setLang,
  setlang: setLang,
  setlanguage: setLang,
  'set-language': setLang
};

export const help = {
  'set-language': {
    parameters: 'language',
    category: 'help'
  }
};
