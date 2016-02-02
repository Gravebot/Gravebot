import R from 'ramda';

// Helpers
import sentry from './config/sentry';

function append(bot, msg, suffix) {
  if(!suffix) {
    bot.sendMessage(msg.channel, 'Usage: **`!!`** `text`');
    return;
  }
  let channelMsgs = msg.channel.messages;
//  console.log(channelMsgs);
  let lastMessage = channelMsgs.getAll("author", msg.author);
  lastMessage.pop(); //pop the !! command
  let original = lastMessage.pop().content;
  original = original.trim();
  bot.sendMessage(msg.channel, original.concat(' ').concat(suffix));
}

export default {
  append: append
};
