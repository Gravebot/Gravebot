import path from 'path';


export default {
  ayylmao: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/m7NaGVx.gif');
    bot.sendFile(msg.channel, path.join(__dirname, '../../images/Ayylmao.png'));
  },
  chillenmyb: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/Qh75Dsi.jpg');
  },
  endall: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/SNmMCQV.png');
  },
  feelsgoodman: (bot, msg) => {
    bot.sendFile(msg.channel, path.join(__dirname, '../../images/Feelsgoodman.png'));
  },
  jpeg: (bot, msg) => {
    bot.sendMessage(msg.channel, 'https://www.youtube.com/watch?v=QEzhxP-pdos');
  },
  kappa: (bot, msg) => {
    bot.sendFile(msg.channel, path.join(__dirname, '../../images/Kappa.png'));
  },
  kappahd: (bot, msg) => {
    bot.sendFile(msg.channel, path.join(__dirname, '../../images/Kappahd.png'));
  },
  skeltal: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/ZX79Q4S.gif');
  },
  starwars4: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/l9VKWWF.gif');
  },
  starwars5: (bot, msg) => {
    bot.sendMessage(msg.channel, 'http://i.imgur.com/eCpwo6J.gif');
  }
};
