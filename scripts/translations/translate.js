#!/usr/bin/env babel-node

import Promise from 'bluebird';
import _fs from 'fs';
import googleTranslate from 'google-translate';
import glob from 'glob';
import path from 'path';
import R from 'ramda';

import { toTitleCase } from '../../src/helpers';

const fs = Promise.promisifyAll(_fs);
const gt = Promise.promisify(googleTranslate(process.env.GOOGLE_TRANSLATE_API).translate);

const supported_languages = [
  'ar', // Arabic
  'bs', // Bosnian
  'bg', // Bulgarian
  'ca', // Catalan
  'cs', // Czech
  'da', // Danish
  'de', // German
  'el', // Greek
  'en', // English
  'es', // Spanish
  'fi', // Finish
  'fr', // French
  'he', // Hebrew
  'hr', // Croatian
  'hu', // Hungarian
  'id', // Indonesian
  'it', // Italian
  'ja', // Japanese
  'ka', // Georgian
  'ko', // Korean
  'ms', // Malay
  'no', // Norwegian
  'lt', // Lithuanian
  'lv', // Latvian
  'nl', // Dutch
  'pl', // Polish
  'pt', // Portuguese
  'pt-br', // Brazillian Portuguese
  'ro', // Romanian
  'ru', // Russian
  'sk', // Slovak
  'sl', // Slovenian
  'sr', // Serbian
  'sv', // Swedish
  'th', // Thai
  'tr', // Turkish
  'vi', // Vietnamese
  'zh-cn', // Chinese Simplified
  'zh-tw' // Chinese Traditional
];

const translations_path = path.join(__dirname, '../../i18n');
const translations = R.fromPairs(R.map(file_name => {
  return [path.basename(file_name).replace(/.json/g, ''), require(file_name)];
}, glob.sync(`${translations_path}/*(!(_source.json))`)));

const source_path = path.join(translations_path, '_source.json');
const _source = require(source_path);


function translate(lang, key) {
  if (R.is(String, _source[key])) {
    _source[key] = {
      text: _source[key],
      done: false
    };
  }

  if (lang === 'en') {
    translations.en[key] = _source[key].text;
    return;
  }

  if (!_source[key].done || !translations[lang][key]) {
    return gt(_source[key].text, 'en', lang)
      .tap(data => {
        // If the key is the same, sometimes google translate doens't like how letters are capitialized.
        if (_source[key].text === data.translatedText) return gt(toTitleCase(_source[key].text), 'en', lang);
      })
      .then(data => translations[lang][key] = data.translatedText);
  }
}

Promise.resolve(supported_languages)
  .each(lang => {
    console.log(`Translating: ${lang}`);
    if (!translations[lang]) translations[lang] = {};

    return Promise.resolve(R.keys(_source))
      .map(R.curry(translate)(lang), {concurrency: 10})
      .then(() => {
        const sorted_translations = {};
        R.forEach(key => {
          sorted_translations[key] = translations[lang][key];
        }, R.keys(translations[lang]).sort());

        return fs.writeFileAsync(`${translations_path}/${lang}.json`, JSON.stringify(sorted_translations, null, 2));
      });
  })
  .then(() => {
    const sorted_source = {};
    R.forEach(key => {
      sorted_source[key] = _source[key];
      sorted_source[key].done = true;
    }, R.keys(_source).sort());

    return fs.writeFileAsync(source_path, JSON.stringify(sorted_source, null, 2), 'utf8');
  })
  .then(() => console.log('Done'))
  .catch(err => console.log(err));
