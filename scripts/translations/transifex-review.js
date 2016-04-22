import Promise from 'bluebird';
import chalk from 'chalk';
import _fs from 'fs';
import glob from 'glob';
import googleTranslate from 'google-translate';
import R from 'ramda';
import _request from 'request';
import path from 'path';
import prompt from 'prompt';


if (!process.env.TRANSIFEX_KEY) {
  console.log('TRANSIFEX_KEY env is not set. Exiting.');
  process.exit(1);
}

const fs = Promise.promisifyAll(_fs);
const gt = Promise.promisify(googleTranslate(process.env.GOOGLE_TRANSLATE_API).translate);
const request = Promise.promisify(_request);

const translations_path = path.join(__dirname, '../../i18n');
const translations = R.fromPairs(R.map(file_name => {
  return [path.basename(file_name).replace(/.json/g, ''), require(file_name)];
}, glob.sync(`${translations_path}/*(!(_source.json|en.json))`)));
const _source = require(path.join(translations_path, '_source.json'));

const new_translations = {};
const to_review = R.fromPairs(R.map(lang => [lang, {}], R.keys(translations)));
const transifex_langs = {
  'zh-cn': 'zh-Hans',
  'zh-tw': 'zh-Hant'
};

const trans_keys = Promise.resolve(R.keys(translations));
trans_keys
  .map(lang => {
    // Temp fix
    if (lang === 'zh-cn' || lang === 'zh-tw') return;

    const url = `https://${process.env.TRANSIFEX_KEY}@www.transifex.com/api/2/project/gravebot/resource/enjson-33/translation/${transifex_langs[lang] || lang}/?mode=default&file`;
    return request(url)
      .then(R.prop('body'))
      .then(JSON.parse)
      .then(body => {
        new_translations[lang] = body;
        R.forEach(key => {
          if (translations[lang][key] !== new_translations[lang][key]) {
            to_review[lang][key] = {
              translation: new_translations[lang][key],
              original: translations[lang][key]
            };
          }
        }, R.keys(body));

        return;
      });
  }, {concurrency: 10})
  .return(trans_keys)
  .each(lang => {
    if (!R.keys(to_review[lang]).length) return;

    return Promise.resolve(R.keys(to_review[lang]))
      .map(key => {
        return gt(to_review[lang][key].translation, lang, 'en')
          .then(res => {
            to_review[lang][key].reserve = res.translatedText;
          });
      }, {concurrency: 10})
      .then(() => {
        R.forEach(key => {
          if (!_source[key]) {
            delete new_translations[lang][key];
            delete to_review[lang][key];
          }
        }, R.keys(to_review[lang]));

        R.forEach(key => {
          console.log(`-----------------------------------
Lang        | ${chalk.white.bold(lang)}
Key         | ${chalk.bold.red(key)}
English     | ${chalk.bold.blue(_source[key].text)}
Reserve     | ${chalk.bold.green(to_review[lang][key].reserve)}
Old Trans   | ${chalk.bold.yellow(to_review[lang][key].original)}
New Trans   | ${chalk.bold.magenta(to_review[lang][key].translation)}`);
        }, R.keys(to_review[lang]));

        return new Promise((resolve, reject) => {
          prompt.start();
          const params = {
            properties: {
              answer: {
                message: 'Would you like to save these translations? [y/n]',
                required: true
              }
            }
          };

          prompt.get(params, (err, res) => {
            if (err) return reject(err);

            if (res.answer === 'y') {
              const merged_translations = R.merge(translations[lang], new_translations[lang]);
              resolve(fs.writeFileAsync(path.join(translations_path, `${lang}.json`), JSON.stringify(merged_translations, null, 2), 'utf8'));
            } else {
              console.log(chalk.bold.red('Translation not saved...'));
              resolve();
            }
          });
        });
      });
  })
  .then(() => console.log('Review Done'));
