import path from 'path';

export default {
  ayylmao: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/m7NaGVx.png');
    bot.sendFile(msg.channel, path.join(__dirname, '../images/Ayylmao.png'));
  },
  chillenmyb: (bot, msg) => {
    bot.sendFile(msg.channel, path.join(__dirname, '../images/Chillenmyb.jpg'));
  },
  feelsgoodman: (bot, msg) => {
    bot.sendFile(msg.channel, path.join(__dirname, '../images/Feelsgoodman.png'));
  },
  kappa: (bot, msg) => {
    bot.sendFile(msg.channel, path.join(__dirname, '../images/Kappa.png'));
  },
  kappahd: (bot, msg) => {
    bot.sendFile(msg.channel, path.join(__dirname, '../images/Kappahd.png'));
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
