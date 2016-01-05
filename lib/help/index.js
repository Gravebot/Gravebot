import english from './english';
import french from './french';
import meme from './meme';

export default {
  aide: (bot, msg, suffix) => {
    suffix = suffix.toLowerCase();
    if (suffix === 'fun') {
      bot.sendMessage(msg.channel, french.fun);
    } else if (suffix === 'utile') {
      bot.sendMessage(msg.channel, french.useful);
    } else if (suffix === 'info') {
      bot.sendMessage(msg.channel, french.info);
    } else if (suffix === 'jeux') {
      bot.sendMessage(msg.channel, english.games);
    } else if (suffix === 'autres') {
      bot.sendMessage(msg.channel, english.other);
    } else {
      bot.sendMessage(msg.channel, french.all);
    }
  },
  commands: (bot, msg) => {
    bot.sendMessage(msg.channel, english.all);
  },
  help: (bot, msg, suffix) => {
    suffix = suffix.toLowerCase();
    if (suffix === 'fun') {
      bot.sendMessage(msg.channel, english.fun);
    } else if (suffix === 'useful') {
      bot.sendMessage(msg.channel, english.useful);
    } else if (suffix === 'info') {
      bot.sendMessage(msg.channel, english.info);
    } else if (suffix === 'games') {
      bot.sendMessage(msg.channel, english.games);
    } else if (suffix === 'other') {
      bot.sendMessage(msg.channel, english.other);
    } else {
      bot.sendMessage(msg.channel, english.all);
    }
  },
  memelist: (bot, msg, suffix) => {
    suffix = suffix.toLowerCase();
    if (suffix === '1') {
      bot.sendMessage(msg.author, meme.list1);
    } else if (suffix === '2') {
      bot.sendMessage(msg.author, meme.list2);
    } else if (suffix === '3') {
      bot.sendMessage(msg.author, meme.list3);
    } else if (suffix === 'full') {
      bot.sendMessage(msg.author, meme.list1);
      bot.sendMessage(msg.author, meme.list2);
      bot.sendMessage(msg.author, meme.list3);
    } else {
      bot.sendMessage(msg.channel, meme.all);
    }
  }
};
