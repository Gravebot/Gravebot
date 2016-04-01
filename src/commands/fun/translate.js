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

function leet(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, T('leet_usage', msg.author.lang));
    return;
  }
  let translation = leetify.convert(suffix);
  bot.sendMessage(msg.channel, translation);
}

function snoop(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, T('snoop_usage', msg.author.lang));
    return;
  }
  gizoogle.string(suffix, (err, translation) => {
    if (err) sentry(err, 'translate', 'snoop');
    bot.sendMessage(msg.channel, translation);
  });
}

function yoda(bot, msg, phrase) {
  if (!phrase) {
    bot.sendMessage(msg.channel, T('yoda_usage', msg.author.lang));
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
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry(err, 'translate', 'yoda');
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function translate(bot, msg) {
  bot.sendMessage(msg.channel, helpText(bot, msg, 'translate'));
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
