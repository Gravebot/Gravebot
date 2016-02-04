import Promise from 'bluebird';
import sentry from '../config/sentry';
import commands from '../index';
import { callCmd } from '../helpers';

function parseMessage(bot, content, msg) {
  let command = content.toLowerCase().split(' ')[0].substring(1);
  let suffix = content.substring(command.length + 2);
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

      let newCmd = messages.pop().content.trim().concat(suffix);
      bot.sendMessage(msg.channel, newCmd);
      parseMessage(bot, newCmd, msg);
    })
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  append: append
};
