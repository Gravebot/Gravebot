import path from 'path';


export default {
  ayylmao: (client, e) => {
    e.message.channel.sendMessage('http://i.imgur.com/m7NaGVx.gif');
    e.message.channel.uploadFile(path.join(__dirname, '../../images/Ayylmao.png'));
  },
  chillenmyb: (client, e) => {
    e.message.channel.sendMessage('http://i.imgur.com/Qh75Dsi.jpg');
  },
  endall: (client, e) => {
    e.message.channel.sendMessage('http://i.imgur.com/SNmMCQV.png');
  },
  feelsgoodman: (client, e) => {
    e.message.channel.uploadFile(path.join(__dirname, '../../images/Feelsgoodman.png'));
  },
  jpeg: (client, e) => {
    e.message.channel.sendMessage('https://www.youtube.com/watch?v=QEzhxP-pdos');
  },
  kappa: (client, e) => {
    e.message.channel.uploadFile(path.join(__dirname, '../../images/Kappa.png'));
  },
  kappahd: (client, e) => {
    e.message.channel.uploadFile(path.join(__dirname, '../../images/Kappahd.png'));
  },
  skeltal: (client, e) => {
    e.message.channel.sendMessage('http://i.imgur.com/ZX79Q4S.gif');
  },
  starwars4: (client, e) => {
    e.message.channel.sendMessage('http://i.imgur.com/l9VKWWF.gif');
  },
  starwars5: (client, e) => {
    e.message.channel.sendMessage('http://i.imgur.com/eCpwo6J.gif');
  }
};

export const help = {
  ayylmao: {category: 'other'},
  chillenmyb: {category: 'other'},
  endall: {category: 'other'},
  feelsgoodman: {category: 'other'},
  jpeg: {category: 'other'},
  kappa: {category: 'other'},
  kappahd: {category: 'other'},
  skeltal: {category: 'other'},
  starwars4: {category: 'other'},
  starwars5: {category: 'other'}
};
