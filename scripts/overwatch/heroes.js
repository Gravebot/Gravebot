import Promise from 'bluebird';
import cheerio from 'cheerio';
import { remove as removeDiacritics } from 'diacritics';
import fs from 'fs';
import path from 'path';
import R from 'ramda';
import request from 'request';

const requestAsync = Promise.promisify(require('request'));


function downloadFile(url, target) {
  console.log(`Downloading: ${url}`);
  return new Promise((resolve, reject) => {
    let req = request(url).pipe(fs.createWriteStream(target));
    req.on('error', err => reject(err));
    req.on('finish', () => resolve());
  });
}

const css = {};

requestAsync('https://playoverwatch.com/en-gb/career/pc/us/Zalik-1146')
  .then(R.prop('body'))
  .then(cheerio.load)
  .then($ => {
    return $('.progress-category').eq(0).children().map((idx, el) => {
      el = $(el);
      const image_name = removeDiacritics(el.find('.title').text().toLowerCase()).replace(/[^a-z0-9]/g, '');
      css[image_name] = R.map(style => R.trim(style).split(':'), el.find('.bar').attr('style').split(';'));
      return {
        image_name,
        url: el.find('img').attr('src')
      };
    }).get();
  })
  .map(hero => {
    const download_path = path.join(__dirname, `../../web/images/overwatch/heroes/${hero.image_name}.png`);
    return downloadFile(hero.url, download_path);
  }, {concurrency: 10})
  .then(() => {
    const keys = R.keys(css).sort();
    const styl = R.join('\n\n', R.map(name => {
      const entry = R.join('\n  ', R.map(R.join(' '), css[name]));
      return `.${name}\n  ${entry.replace(/0\./g, '.')}`;
    }, keys));
    fs.writeFileSync(path.join(__dirname, '../../web/styl/ow_heroes.styl'), styl);
  });
