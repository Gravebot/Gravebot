import Promise from 'bluebird';
import cheerio from 'cheerio';
import leetify from 'leet';
import R from 'ramda';

import { subCommands as helpText } from '../help';
import T from '../../translate';

const request = Promise.promisify(require('request'));
const gizoogle = Promise.promisifyAll(require('gizoogle'));

function leet(suffix, lang) {
  if (!suffix) return Promise.resolve(T('leet_usage', lang));
  return Promise.resolve(leetify.convert(suffix));
}

function snoop(suffix, lang) {
  if (!suffix) return Promise.resolve(T('snoop_usage', lang));
  return gizoogle.stringAsync(suffix);
}

function yoda(phrase, lang) {
  if (!phrase) return Promise.resolve(T('yoda_usage', lang));

  const options = {
    url: 'http://www.yodaspeak.co.uk/index.php',
    method: 'POST',
    form: {
      YodaMe: phrase,
      go: 'Convert to Yoda-Speak!'
    }
  };

  return request(options)
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('textarea[name="YodaSpeak"]').first().text());
}

function translate(suffix, lang) {
  return helpText('translate', lang);
}

export default {
  leet,
  leetify: leet,
  1337: leet,
  snoop,
  snoopify: snoop,
  translate,
  yoda: yoda,
  yodaify: yoda
};

export const help = {
  translate: {
    prefix: false,
    header_text: 'translate_header_text',
    subcommands: [
      {name: 'leet'},
      {name: 'snoop'},
      {name: 'yoda'}
    ]
  }
};
