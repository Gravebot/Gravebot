#!/usr/bin/env babel-node

import Promise from 'bluebird';
import _fs from 'fs';
import glob from 'glob';
import path from 'path';
import R from 'ramda';

const fs = Promise.promisifyAll(_fs);


const translations_path = path.join(__dirname, '../i18n');
const translations = R.fromPairs(R.map(file_name => {
  return [path.basename(file_name).replace(/.json/g, ''), require(file_name)];
}, glob.sync(`${translations_path}/*(!(_source.json))`)));

const source_path = path.join(translations_path, '_source.json');
const _source = require(source_path);


function translate(lang, key) {
  if (R.is(String, _source[key])) {
    _source[key] = {
      msg: _source[key],
      done: false
    };
  }

  if (lang === 'en') {
    translations.en[key] = _source[key].msg;
    return;
  }

  // if (!_source[key].done || !translations[lang][key])
}

Promise.resolve(R.keys(translations))
  .each(lang => {
    return Promise.resolve(R.keys(_source))
      .each(R.curry(translate)(lang))
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
