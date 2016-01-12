import Cleverbot from 'cleverbot.io';
import gizoogle from 'gizoogle';
import nconf from 'nconf';
import R from 'ramda';
import urban from 'urban';
import Wiki from 'wikijs';

// Helpers
import { mergeCommands } from './helpers';
import sentry from './config/sentry';

// Data
import { choices, eightball, quotes } from '../data';

// Init
const clever = new Cleverbot(nconf.get('CLEVERBOT_API_NAME'), nconf.get('CLEVERBOT_API_KEY'));
clever.setNick('Gravebot');

let misc_commands = {
  '8ball': (bot, msg, suffix) => {
    if (suffix.length === 0) {
      bot.sendMessage(msg.channel, `${msg.author} You call that a question?\nhttp://i.imgur.com/PcXHbt6.gif`);
    } else {
      let rand = Math.floor(Math.random() * eightball.length);
      bot.sendMessage(msg.channel, `${msg.author}:crystal_ball:**${eightball[rand]}**:crystal_ball:`);
    }
  },
  chat: (bot, msg, suffix) => {
    if (!nconf.get('CLEVERBOT_API_NAME') || !nconf.get('CLEVERBOT_API_KEY')) {
      bot.sendMessage(msg.channel, 'Please setup cleverbot in config.js to use the **`!chat`** command.');
      return;
    }

    clever.create((err, session) => {
      if (err) sentry.captureError(err);
      clever.ask(suffix, (err, response) => {
        if (err) sentry.captureError(err);
        bot.sendMessage(msg.channel, response);
      });
    });
  },
  coin: (bot, msg) => {
    let number = Math.floor(Math.random() * 2) + 1;
    if (number === 1) {
      bot.sendFile(msg.channel, './images/Heads.png');
    } else {
      bot.sendFile(msg.channel, './images/Tails.png');
    }
  },
  decide: (bot, msg, suffix) => {
    function multipleDecide(options) {
      var selected = options[Math.floor(Math.random() * options.length)];
      if (!selected) return multipleDecide(options);
      return selected;
    }

    let split = suffix.split(' or ');
    let rand = Math.floor(Math.random() * choices.length);
    if (split.length > 1) {
      bot.sendMessage(msg.channel, `${choices[rand]} **${multipleDecide(split)}**`);
    } else {
      bot.sendMessage(msg.channel, 'Usage: **`!decide`** `something` **`or`** `something...`');
    }
  },
  quote: (bot, msg, suffix) => {
    let rand = Math.floor(Math.random() * quotes.length);
    if (suffix && suffix >= 0 && suffix <= (quotes.length - 1)) {
      bot.sendMessage(msg.channel, quotes[suffix]);
    } else {
      bot.sendMessage(msg.channel, quotes[rand]);
    }
  },
  snoopify: (bot, msg, suffix) => {
    if (!suffix) {
      bot.sendMessage(msg.channel, 'Usage: **`!snoopify`** `sentence`');
      return;
    }
    gizoogle.string(suffix, (err, translation) => {
      if (err) sentry.captureError(err);
      bot.sendMessage(msg.channel, translation);
    });
  },
  urban: (bot, msg, suffix) => {
    if (!suffix) {
      bot.sendMessage(msg.channel, 'Usage: **`!urban`** `search terms`');
      return;
    }
    urban(suffix).first((json) => {
      if (json) {
        let definition = `${json.word}: ${json.definition}
:arrow_up: ${json.thumbs_up}   :arrow_down: ${json.thumbs_down}

Example: ${json.example}`;
        bot.sendMessage(msg.channel, definition);
      } else {
        bot.sendMessage(msg.channel, `I couldn't find a definition for: ${suffix}`);
      }
    });
  },
  wiki: (bot, msg, suffix) => {
    if (!suffix) {
      bot.sendMessage(msg.channel, 'Usage: **`!wiki`** `search terms`');
      return;
    }
    new Wiki().search(suffix, 1).then(function(data) {
      new Wiki().page(data.results[0]).then(function(page) {
        page.summary().then(function(summary) {
          let sum_text = summary.toString().split('\n');
          R.forEach(paragraph => {
            bot.sendMessage(msg.channel, paragraph);
          }, sum_text);
        });
      });
    });
  }
};

// Merge all the commands objecs together and export.
let commands = mergeCommands(misc_commands);
export default commands;
