import Promise from 'bluebird';
import fs from 'fs';
import path from 'path';
import R from 'ramda';
import request from 'request';


const requester = Promise.promisify(request);

function downloadFile(url, target) {
  console.log(`Downloading: ${url}`);
  return new Promise((resolve, reject) => {
    let req = request(url).pipe(fs.createWriteStream(target));
    req.on('error', err => reject(err));
    req.on('finish', () => resolve());
  });
}

let version;
requester({url: 'https://ddragon.leagueoflegends.com/realms/na.json', json: true})
  .then(R.path(['body', 'v']))
  .then(v => {
    version = v;
    return requester({url: `https://ddragon.leagueoflegends.com/cdn/${v}/data/en_US/item.json`, json: true});
  })
  .then(R.path(['body', 'data']))
  .tap(data => {
    let vals = R.values(data);
    let item_data = R.zipObj(R.keys(data), R.pluck('name')(vals));
    fs.writeFileSync(path.join(__dirname, '../../src/data/lol_items.json'), JSON.stringify(item_data, null, 2), 'utf8');
  })
  .then(R.keys)
  .map(id => {
    let download_path = path.join(__dirname, `../../web/images/leagueoflegends/items/${id}.png`);
    return downloadFile(`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`, download_path);
  }, {concurrency: 10});
