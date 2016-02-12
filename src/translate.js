import chalk from 'chalk';
import glob from 'glob';
import path from 'path';
import R from 'ramda';


const translations_path = path.join(__dirname, '../i18n');
const translations = R.fromPairs(R.map(file_path => {
  return [path.basename(file_path).replace(/.json/g, ''), require(file_path)];
}, glob.sync(`${translations_path}/*(!(_source.json))`)));

export default function translate(key, lang) {
  const translation = translations[lang][key] || translations.en[key];
  if (!translation) return console.log(chalk.yellow(`[WARN] ${key} does not have a translation`));
  if (!translations[lang][key]) console.log(chalk.yellow(`[WARN] ${key} in language ${lang} does not exist`));

  return translation;
}
