function appearin(bot, msg) {
  let id = Math.random().toString().replace('.', '').slice(0, 10);
  bot.sendMessage(msg.channel, `https://appear.in/${id}`);
}

export default {
  appearin,
  ss: appearin,
  videocall: appearin
};
