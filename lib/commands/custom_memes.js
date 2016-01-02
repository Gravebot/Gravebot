export default {
  ayylmao: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/m7NaGVx.png');
    bot.sendFile(msg.channel, '../../imagesAyylmao.png');
  },
  chillenmyb: (bot, msg) => {
    bot.sendFile(msg.channel, '../../imagesChillenmyb.jpg');
  },
  feelsgoodman: (bot, msg) => {
    bot.sendFile(msg.channel, '../../imagesFeelsgoodman.png');
  },
  kappa: (bot, msg) => {
    bot.sendFile(msg.channel, '../../imagesKappa.png');
  },
  kappahd: (bot, msg) => {
    bot.sendFile(msg.channel, '../../imagesKappahd.png');
  },
  skeltal: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/ZX79Q4S.png');
  },
  starwars4: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/l9VKWWF.png');
  },
  starwars5: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/eCpwo6J.png');
  }
};
