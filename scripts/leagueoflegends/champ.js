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
    return requester({url: `https://ddragon.leagueoflegends.com/cdn/${v}/data/en_US/champion.json`, json: true});
  })
  .then(R.path(['body', 'data']))
  .tap(data => {
    let champs = R.map(champ => {
      if (champ.id === 'MonkeyKing') champ.id = 'wukong';
      return {
        id: champ.key,
        name: champ.name,
        nid: champ.id.toLowerCase(),
        image: champ.image.full.toLowerCase()
      };
    }, R.values(data));
    champs = R.zipObj(R.pluck('nid')(champs), champs);

    fs.writeFileSync(path.join(__dirname, '../../src/data/lol_champs.json'), JSON.stringify(champs, null, 2), 'utf8');
  })
  .then(R.keys)
  .map(id => {
    let download_path = path.join(__dirname, `../../web/images/leagueoflegends/champs/${id.toLowerCase()}.png`);
    return downloadFile(`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${id}.png`, download_path);
  }, {concurrency: 10});
