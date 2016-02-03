import Promise from 'bluebird';
import sentry from '../config/sentry';

function append(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, 'Usage: **`!!`** `text`');
    return;
  }

  Promise.resolve(msg.channel.messages.getAll('author', msg.author))
    .then(messages => {
      messages.pop();
      if (messages[0] === undefined) {
        return;
      }

      let newCmd = messages.pop().content.trim().concat(suffix);
      bot.sendMessage(msg.channel, newCmd);
    })
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  append: append
};
