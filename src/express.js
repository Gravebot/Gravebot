import bodyParser from 'body-parser';
import express from 'express';
import glob from 'glob';
import fs from 'fs';
import { load as markoLoad } from 'marko';
import nconf from 'nconf';
import nib from 'nib';
import R from 'ramda';
import path from 'path';
import stylus from 'stylus';

import logger from './logger';


// Marko template renders
const marko = R.fromPairs(R.map(file_path => {
  return [path.basename(file_path, '.marko'), markoLoad(file_path)];
}, glob.sync(path.join(__dirname, '../web/views/*.marko'))));


function checkIP(req, res, next) {
  if (nconf.get('NODE_ENV') !== 'production') return next();
  if (req.ip === '::ffff:127.0.0.1') return next();
  res.status(401).send({error: '401'});
}

export default function startExpress() {
  const app = express();
  app.use(bodyParser.json());
  app.use(express.static('web'));

  app.get('/style/:file', (req, res) => {
    const css_path = path.join(__dirname, `../web/css/${req.params.file}`);
    if (nconf.get('NODE_ENV') !== 'development') {
      if (!fs.existsSync(css_path)) return res.redirect('/404');
      return res.sendFile(css_path);
    }

    const styl_path = css_path.replace(/css/g, 'styl');
    if (!fs.existsSync(styl_path)) return res.redirect('/404');
    stylus(fs.readFileSync(styl_path, 'utf8'))
      .set('src', path.join(__dirname, '../web/styl'))
      .set('filename', path.basename(styl_path))
      .set('compress', true)
      .use(nib())
      .render((err, css) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
        res.status(200).send(css);
      });
  });

  // Render view for images
  app.post('/view/:view', checkIP, (req, res) => {
    marko[req.params.view].render(req.body, res);
  });

  // Health check endpoint
  app.use('/', (req, res) => {
    res.json({status: 'okay'});
  });

  app.get('*', (req, res) => {
    res.status(404).json({status: 404});
  });

  if (!nconf.get('PORT')) nconf.set('PORT', 5000);
  logger.info(`Express listening on port ${nconf.get('PORT')}`);
  app.listen(nconf.get('PORT'));
}
