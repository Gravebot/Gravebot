import Promise from 'bluebird';
import cheerio from 'cheerio';
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

requestAsync('https://playoverwatch.com/en-gb/career/pc/us/Zalik-1146')
  .then(R.prop('body'))
  .then(cheerio.load)
  .then($ => {
    return $('.progress-category').eq(0).children().map((idx, el) => {
      el = $(el);
      return {
        image_name: el.find('.title').text().toLowerCase().replace(/[^a-z0-9]/g, ''),
        url: el.find('img').attr('src')
      };
    }).get();
  })
  .map(hero => {
    const download_path = path.join(__dirname, `../../web/images/overwatch/heroes/${hero.image_name}.png`);
    return downloadFile(hero.url, download_path);
  }, {concurrency: 10});
