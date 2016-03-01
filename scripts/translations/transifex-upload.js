import Promise from 'bluebird';
import fs from 'fs';
import glob from 'glob';
import R from 'ramda';
import request from 'request';
import path from 'path';


if (!process.env.TRANSIFEX_KEY) {
  console.log('TRANSIFEX_KEY env is not set. Exiting.');
  process.exit(1);
}

if (!process.env.GOOGLE_TRANSLATE_API) {
  console.log('GOOGLE_TRANSLATE_API env is not set. Exiting.');
  process.exit(1);
}

const translations_path = path.join(__dirname, '../../i18n');
let translations = R.map(file_path => {
  return {
    lang: path.basename(file_path).replace(/.json/g, ''),
    file_path: file_path
  };
}, glob.sync(`${translations_path}/*(!(_source.json|en.json))`));
translations = [{lang: 'en', file_path: path.join(translations_path, 'en.json')}].concat(translations);


function uploadTranslation(data) {
  let url;
  if (data.lang === 'en') {
    url = `https://${process.env.TRANSIFEX_KEY}@www.transifex.com/api/2/project/gravebot/resource/enjson-33/content/`;
  } else {
    url = `https://${process.env.TRANSIFEX_KEY}@www.transifex.com/api/2/project/gravebot/resource/enjson-33/translation/${data.lang}/`;
  }

  console.log(`Uploading: ${data.lang}`);
  const options = {
    method: 'PUT',
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  };

  return new Promise((resolve, reject) => {
    const req = request(options, function(err, res, body) {
      if (err) return reject(err);
      console.log(res.statusCode);
      console.log(body);
      resolve();
    });

    req.form().append('file', fs.createReadStream(data.file_path));
  });
}


Promise.resolve(translations)
  .each(uploadTranslation)
  .then(() => console.log('Done'))
  .catch(err => console.log(err.stack || err));
