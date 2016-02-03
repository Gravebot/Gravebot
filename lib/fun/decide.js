import { choices } from '../../data';


function decide(bot, msg, suffix) {
  function multipleDecide(options) {
    const selected = options[Math.floor(Math.random() * options.length)];
    if (!selected) return multipleDecide(options);
    return selected;
  }

  const split = suffix.split(' or ');
  const rand = Math.floor(Math.random() * choices.length);
  if (split.length > 1) {
    bot.sendMessage(msg.channel, `${choices[rand]} **${multipleDecide(split)}**`);
  } else {
    bot.sendMessage(msg.channel, 'Usage: **`!decide`** `something` **`or`** `something...`');
  }
}

export default {
  choice: decide,
  choose: decide,
  decide
};
