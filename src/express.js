import bodyParser from 'body-parser';
import chalk from 'chalk';
import express from 'express';
import glob from 'glob';
import fs from 'fs';
import { load as markoLoad } from 'marko';
import nconf from 'nconf';
import nib from 'nib';
import R from 'ramda';
import path from 'path';
import stylus from 'stylus';


// Marko template renders
const marko = R.fromPairs(R.map(file_path => {
  return [path.basename(file_path, '.marko'), markoLoad(file_path)];
}, glob.sync(path.join(__dirname, '../web/views/*.marko'))));


function checkIP(req, res, next) {
  if (nconf.get('NODE_ENV') !== 'production') return next();
  if (req.ip === '::ffff:127.0.0.1') return next();
  res.status(401).send({error: '401'});
}


const app = express();
app.use(bodyParser.json());
app.use(express.static('web'));

app.get('/style/:file', checkIP, (req, res) => {
  let file_name = `./web/styl/${req.params.file}`;
  if (fs.existsSync(file_name)) {
    stylus(fs.readFileSync(file_name, 'utf8'))
      .set('filename', path.basename(file_name))
      .set('compress', true)
      .use(nib())
      .render((err, css) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(css);
      });
  } else {
    res.status(404);
  }
});

// Render view for images
app.post('/view/:view', checkIP, (req, res) => {
  marko[req.params.view].render(req.body, res);
});

// Health check endpoint
app.use('/', (req, res) => {
  res.json({status: 'okay'});
});

if (!nconf.get('PORT')) nconf.set('PORT', 5000);
console.log(chalk.cyan(`Express listening on port ${nconf.get('PORT')}`));
app.listen(nconf.get('PORT'));
