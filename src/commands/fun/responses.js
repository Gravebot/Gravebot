import { drama as _drama, emoji as _emoji, quotes } from '../../data';


function drama(bot, msg, suffix) {
  const rand = Math.floor(Math.random() * _drama.length);
  if (suffix && suffix >= 0 && suffix <= (_drama.length - 1)) {
    bot.sendMessage(msg.channel, _drama[suffix]);
  } else {
    bot.sendMessage(msg.channel, _drama[rand]);
  }
}

function emoji(bot, msg, suffix) {
  const rand = Math.floor(Math.random() * _emoji.length);
  if (suffix && suffix >= 0 && suffix <= (_emoji.length - 1)) {
    bot.sendMessage(msg.channel, _emoji[suffix]);
  } else {
    bot.sendMessage(msg.channel, _emoji[rand]);
  }
}

function quote(bot, msg, suffix) {
  const rand = Math.floor(Math.random() * quotes.length);
  if (suffix && suffix >= 0 && suffix <= (quotes.length - 1)) {
    bot.sendMessage(msg.channel, quotes[suffix]);
  } else {
    bot.sendMessage(msg.channel, quotes[rand]);
  }
}

export default {
  drama,
  emoji,
  emojis: emoji,
  quote
};

export const help = {
  drama: {parameters: 'number'},
  emoji: {parameters: 'number'},
  quote: {parameters: 'number'}
};
