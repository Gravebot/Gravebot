import Cleverbot from 'cleverbot.io';
import gizoogle from 'gizoogle';
import Imgflipper from 'imgflipper';
import nconf from 'nconf';
import R from 'ramda';
import urban from 'urban';
import Wiki from 'wikijs';

// Helpers
import { mergeCommands } from './helpers';

// Data
import { choices, drama, eightball, emoji, memes, quotes } from '../data';

// Init
const clever = new Cleverbot(nconf.get('CLEVERBOT_API_NAME'), nconf.get('CLEVERBOT_API_KEY'));
const imgflipper = new Imgflipper(nconf.get('IMGFLIP_USERNAME'), nconf.get('IMGFLIP_PASSWORD'));
clever.setNick('Gravebot');

let misc_commands = {
  '8ball': (bot, msg, suffix) => {
    if (suffix.length === 0) {
      bot.sendMessage(msg.channel, `${msg.author} You call that a question?\nhttp://i.imgur.com/PcXHbt6.png`);
    } else {
      let rand = Math.floor(Math.random() * eightball.length);
      bot.sendMessage(msg.channel, `${msg.author}:crystal_ball:**${eightball[rand]}**:crystal_ball:`);
    }
  },
  avatar: (bot, msg, suffix) => {
    if (msg.mentions.length === 0) {
      if (msg.author.avatarURL === null) {
        bot.sendMessage(msg.channel, 'You are naked.');
      } else {
        bot.sendMessage(msg.channel, `Your avatar:\n${msg.author.avatarURL}`);
      }
      return;
    }
    let msg_array = R.map(user => {
      if (user.avatarURL === null) return `${user.username} is naked.`;
      return `${user.username}\'s avatar:\n${user.avatarURL}`;
    }, msg.mentions);
    bot.sendMessage(msg.channel, msg_array);
  },
  chat: (bot, msg, suffix) => {
    if (!nconf.get('CLEVERBOT_API_NAME') || !nconf.get('CLEVERBOT_API_KEY')) {
      bot.sendMessage(msg.channel, 'Please setup cleverbot in config.js to use the **`!chat`** command.');
      return;
    }
    let cb = msg.content.split(' ')[0].substring(1);
    let cbi = msg.content.substring(cb.length + 2);

    clever.create((err, session) => {
      if (err) console.error(err);
      clever.ask(cbi, (err, response) => {
        if (err) console.error(err);
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
  drama: (bot, msg, suffix) => {
    let rand = Math.floor(Math.random() * drama.length);
    if (suffix && suffix >= 0 && suffix <= (drama.length - 1)) {
      bot.sendMessage(msg.channel, drama[suffix]);
    } else {
      bot.sendMessage(msg.channel, drama[rand]);
    }
  },
  emoji: (bot, msg, suffix) => {
    let rand = Math.floor(Math.random() * emoji.length);
    if (suffix && suffix >= 0 && suffix <= (emoji.length - 1)) {
      bot.sendMessage(msg.channel, emoji[suffix]);
    } else {
      bot.sendMessage(msg.channel, emoji[rand]);
    }
  },
  meme: (bot, msg, suffix) => {
    if (!nconf.get('IMGFLIP_USERNAME') || !nconf.get('IMGFLIP_PASSWORD')) {
      bot.sendMessage(msg.channel, 'Please setup imgflip in config.js to use the **`!meme`** command.');
      return;
    }

    let usage_message = 'Usage: **`!meme`** `meme name` `"top text"` `"bottom text"`\nWrite **`!memelist`** for a list of meme names.';
    if (!suffix) {
      bot.sendMessage(msg.channel, usage_message);
      return;
    }
    let tags = msg.content.split('"');
    let memetype = tags[0].split(' ')[1];

    imgflipper.generateMeme(memes[memetype], tags[1] ? tags[1] : '', tags[3] ? tags[3] : '', (err, image) => {
      if (err) {
        console.error(err);
        bot.sendMessage(msg.channel, usage_message);
      } else {
        bot.sendMessage(msg.channel, image);
      }
    });
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
      if (err) console.error(err);
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
