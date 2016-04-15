import Promise from 'bluebird';
import cheerio from 'cheerio';
import gizoogle from 'gizoogle';
import leetify from 'leet';
import _request from 'request';
import R from 'ramda';

import { subCommands as helpText } from '../help';
import sentry from '../../sentry';
import T from '../../translate';


const request = Promise.promisify(_request);

function leet(client, e, suffix, lang) {
  if (!suffix) {
    e.message.channel.sendMessage(T('leet_usage', lang));
    return;
  }
  let translation = leetify.convert(suffix);
  e.message.channel.sendMessage(translation);
}

function snoop(client, e, suffix, lang) {
  if (!suffix) {
    e.message.channel.sendMessage(T('snoop_usage', lang));
    return;
  }
  gizoogle.string(suffix, (err, translation) => {
    if (err) sentry(err, 'translate', 'snoop');
    e.message.channel.sendMessage(translation);
  });
}

function yoda(client, e, phrase, lang) {
  if (!phrase) {
    e.message.channel.sendMessage(T('yoda_usage', lang));
    return;
  }

  const options = {
    url: 'http://www.yodaspeak.co.uk/index.php',
    method: 'POST',
    form: {
      YodaMe: phrase,
      go: 'Convert to Yoda-Speak!'
    }
  };

  request(options)
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('textarea[name="YodaSpeak"]').first().text())
    .then(text => e.message.channel.sendMessage(text))
    .catch(err => {
      sentry(err, 'translate', 'yoda');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

function translate(client, e, suffix, lang) {
  e.message.channel.sendMessage(helpText(client, e, 'translate', lang));
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
