import Promise from 'bluebird';
import sentry from '../../sentry';
import commands from '../index';
import { callCmd } from '../../index';

function parseMessage(bot, content, msg) {
  let command = content.toLowerCase().split(' ')[0].substring(1);
  let suffix = content.substring(command.length + 3);
  let cmd = commands[command];

  if (cmd) {
    callCmd(cmd, command, bot, msg, suffix);
  }
  return;
}


function append(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, 'Usage: **`!!`** `text`');
    return;
  }

  Promise.resolve(msg.channel.messages.getAll('author', msg.author))
    .then(messages => {
      messages.pop();
      if (!messages[0]) {
        return;
      }

      const newCmd = messages.pop().content.trim().concat(' ').concat(suffix);
      parseMessage(bot, newCmd, msg);
    })
    .catch(err => {
      sentry(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  append: append
};
