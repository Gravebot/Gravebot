import Promise from 'bluebird';
import path from 'path';


export default {
  ayylmao: () => Promise.resolve([
    'http://i.imgur.com/m7NaGVx.gif',
    {upload: path.join(__dirname, '../../images/Ayylmao.png')}
  ]),
  chillinmyb: () => Promise.resolve('http://i.imgur.com/Qh75Dsi.jpg'),
  endall: () => Promise.resolve('http://i.imgur.com/SNmMCQV.png'),
  feelsbadman: () => Promise.resolve({upload: path.join(__dirname, '../../images/Feelsbadman.png')}),
  feelsgoodman: () => Promise.resolve({upload: path.join(__dirname, '../../images/Feelsgoodman.png')}),
  jpeg: () => Promise.resolve('https://www.youtube.com/watch?v=QEzhxP-pdos'),
  kappa: () => Promise.resolve({upload: path.join(__dirname, '../../images/Kappa.png')}),
  kappahd: () => Promise.resolve({upload: path.join(__dirname, '../../images/Kappahd.png')}),
  skeltal: () => Promise.resolve('http://i.imgur.com/ZX79Q4S.gif'),
  starwars4: () => Promise.resolve('http://i.imgur.com/l9VKWWF.gif'),
  starwars5: () => Promise.resolve('http://i.imgur.com/eCpwo6J.gif')
};

export const help = {
  ayylmao: {category: 'other'},
  chillinmyb: {category: 'other'},
  endall: {category: 'other'},
  feelsbadman: {category: 'other'},
  feelsgoodman: {category: 'other'},
  jpeg: {category: 'other'},
  kappa: {category: 'other'},
  kappahd: {category: 'other'},
  skeltal: {category: 'other'},
  starwars4: {category: 'other'},
  starwars5: {category: 'other'}
};
