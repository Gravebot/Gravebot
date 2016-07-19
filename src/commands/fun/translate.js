import Promise from 'bluebird';
import cheerio from 'cheerio';
import leetify from 'leet';
import R from 'ramda';

import { subCommands as helpText } from '../help';
import T from '../../translate';

const request = Promise.promisify(require('request'));
const gizoogle = Promise.promisifyAll(require('gizoogle'));

function leet(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('leet_usage', lang));
  return Promise.resolve(leetify.convert(suffix.toLowerCase()));
}

function snoop(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('snoop_usage', lang));
  return gizoogle.stringAsync(suffix.toLowerCase());
}

function yoda(client, evt, phrase, lang) {
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

function translate(client, evt, suffix, lang) {
  const split_suffix = suffix.split(' ');
  const cmd = split_suffix[0];
  split_suffix.shift();
  suffix = split_suffix.join(' ');

  if (cmd === 'leet') return leet(client, evt, suffix, lang);
  if (cmd === 'snoop') return snoop(client, evt, suffix, lang);
  if (cmd === 'yoda') return yoda(client, evt, suffix, lang);
  return helpText(client, evt, 'translate', lang);
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
