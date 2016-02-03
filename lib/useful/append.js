import Promise from 'bluebird';
import R from 'ramda';
import { callCmd } from '../helpers';
import commands from '../';

function parseMessage(bot, content, msg) {
  let command = content.toLowerCase().split(' ')[0].substring(1);
  let suffix = content.substring(command.length + 2);
  let cmd = commands[command];

  if(cmd) {
    callCmd(cmd, command, bot, msg, suffix);
  }
  return;
}

function doAppend(bot, msg, suffix) {
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
        parseMessage(bot, newCmd, msg);
        bot.sendMessage(msg.channel, newCmd);
      }
   });
}

export default {
  append,
  append: doAppend
};
