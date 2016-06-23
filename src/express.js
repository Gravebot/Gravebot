import bodyParser from 'body-parser';
import autoprefixer from 'autoprefixer';
import chalk from 'chalk';
import express from 'express';
import glob from 'glob';
import fs from 'fs';
import { load as markoLoad } from 'marko';
import nconf from 'nconf';
import R from 'ramda';
import path from 'path';
import postcss from 'postcss';
import sass from 'node-sass';


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
  const file_path = path.join(__dirname, `../web/css/${req.params.file}`);
  if (nconf.get('NODE_ENV') !== 'development') {
    if (!fs.existsSync(file_path)) return res.redirect('/404');
    res.sendFile(file_path);
  }

  const scss_path = file_path.replace(/css/g, 'scss');
  console.log(scss_path);
  if (!fs.existsSync(scss_path)) return res.redirect('/404');
  sass.render({file: scss_path}, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({status: 500});
    }
    postcss([autoprefixer])
      .process(results.css.toString()).then(result => {
        result.warnings().forEach(warn => console.warn(warn.toString()));
        res.status(200).send(result.css);
      });
  });
});

// Render view for images
app.post('/view/:view', checkIP, (req, res) => {
  console.log(JSON.stringify(req.body));
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
console.log(chalk.cyan(`Express listening on port ${nconf.get('PORT')}`));
app.listen(nconf.get('PORT'));
