import R from 'ramda';


function appearin(bot, msg) {
  let id = Math.random().toString().replace('.', '').slice(0, 10);
  let url = `https://appear.in/${id}`;

  // If no mentions, send link back to channel.
  if (!msg.mentions.length) return bot.sendMessage(msg.channel, url);

  // Send url back to author and mentioend users
  bot.sendMessage(msg.author, url);
  R.forEach(user => bot.sendMessage(user, `${msg.author.name} would like you to join a videocall/screenshare. ${url}`), msg.mentions);
}

export default {
  appearin,
  ss: appearin,
  videocall: appearin
};
