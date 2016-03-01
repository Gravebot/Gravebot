import R from 'ramda';


function appearin(bot, msg) {
  const id = Math.random().toString().replace('.', '').slice(0, 10);
  const url = `https://appear.in/${id}`;

  // If no mentions, send link back to channel.
  if (!msg.mentions.length) return bot.sendMessage(msg.channel, url);

  // Send url back to author and mentioned users
  bot.sendMessage(msg.author, url);
  R.forEach(user => bot.sendMessage(user, `${msg.author.name} would like you to join a videocall/screenshare.\n${url}`), msg.mentions);
}

export default {
  appearin,
  ss: appearin,
  videocall: appearin,
  videochat: appearin
};

export const help = {
  videocall: {
    parameters: ['@username']
  }
};
