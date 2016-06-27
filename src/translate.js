import glob from 'glob';
import path from 'path';
import R from 'ramda';

import logger from './logger';


// Load in translations
const translations_path = path.join(__dirname, '../i18n');
const translations = R.fromPairs(R.map(file_path => {
  return [path.basename(file_path).replace(/.json/g, ''), require(file_path)];
}, glob.sync(`${translations_path}/*(!(_source.json))`)));

// Load up variables that don't require translations
// TODO: Temporary workaround to fix tests failing.
let static_texts = {};
if (!process.env.TEST) {
  static_texts = R.map(js_path => {
    const help_data = require(js_path).help;
    if (help_data) return R.map(R.prop('static_texts'), R.values(help_data));
  }, require('./commands').command_files);
  static_texts = R.mergeAll(R.reject(R.isNil, R.flatten(static_texts)));
}

export default function translate(key, lang = 'en') {
  let translation = translations[lang][key] || translations.en[key] || '';
  if (!translations[lang][key]) logger.warn(`${key} in language ${lang} does not exist`);

  const static_text = translation.match(/[^#{]+(?=\})/g);
  if (static_text) {
    R.forEach(key => {
      if (static_texts[key]) translation = translation.replace(new RegExp(`#{${key}}`, 'g'), static_texts[key]);
    }, static_text);
  }

  return translation;
}

export const langs = R.keys(translations);
