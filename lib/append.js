import R from 'ramda';
import Promise from 'bluebird';
import { parseMessage } from '../server';

function append(bot, msg, suffix) {
  if(!suffix) {
    bot.sendMessage(msg.channel, 'Usage: **`!!`** `text`');
    return;
  }

  Promise.resolve(msg.channel.messages.getAll('author', msg.author))
    .then(messages => {
      messages.pop();
      if(messages[0] === undefined) {
        return;
      }
      else {
        let newCmd = messages.pop().content.trim().concat(suffix);
        parseMessage(newCmd, msg);
        bot.sendMessage(msg.channel, newCmd);
      }
   });
}

export default {
  append: append
};
