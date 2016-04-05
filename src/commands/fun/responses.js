import { drama as _drama, emoji as _emoji, quotes } from '../../data';


function drama(client, e, suffix) {
  const rand = Math.floor(Math.random() * _drama.length);
  if (suffix && suffix >= 0 && suffix <= (_drama.length - 1)) {
    e.message.channel.sendMessage(_drama[suffix]);
  } else {
    e.message.channel.sendMessage(_drama[rand]);
  }
}

function emoji(client, e, suffix) {
  const rand = Math.floor(Math.random() * _emoji.length);
  if (suffix && suffix >= 0 && suffix <= (_emoji.length - 1)) {
    e.message.channel.sendMessage(_emoji[suffix]);
  } else {
    e.message.channel.sendMessage(_emoji[rand]);
  }
}

function quote(client, e, suffix) {
  const rand = Math.floor(Math.random() * quotes.length);
  if (suffix && suffix >= 0 && suffix <= (quotes.length - 1)) {
    e.message.channel.sendMessage(quotes[suffix]);
  } else {
    e.message.channel.sendMessage(quotes[rand]);
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
