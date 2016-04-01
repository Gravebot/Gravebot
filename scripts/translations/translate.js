#!/usr/bin/env babel-node

import Promise from 'bluebird';
import _fs from 'fs';
import googleTranslate from 'google-translate';
import glob from 'glob';
import path from 'path';
import R from 'ramda';

import { toTitleCase } from '../../src/helpers';
import supported_languages from './supported_languages';


if (!process.env.GOOGLE_TRANSLATE_API) {
  console.log('GOOGLE_TRANSLATE_API env is not set. Exiting.');
  process.exit(1);
}

const fs = Promise.promisifyAll(_fs);
const gt = Promise.promisify(googleTranslate(process.env.GOOGLE_TRANSLATE_API).translate);

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
    const original_text = _source[key].text
      .replace(/\n/g, '<n>')
      .replace(/\*\*/g, '<**>')
      .replace(/!/g, '<!>')
      .replace(/#{/g, '<')
      .replace(/\}/g, '>');
    return gt(original_text, 'en', lang)
      .tap(data => {
        // If the key is the same, sometimes google translate doens't like how letters are capitialized.
        if (_source[key].text === data.translatedText) return gt(toTitleCase(_source[key].text), 'en', lang);
      })
      .then(data => translations[lang][key] = data.translatedText
        .replace(/ <n> /g, '\n').replace(/<n>/g, '\n')
        .replace(/ <\*\*> /g, '**').replace(/<\*\*>/g, '**')
        .replace(/ <!> /g, '!').replace(/<!>/g, '!')
        .replace(/</g, '#{')
        .replace(/\>/g, '}'));
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
