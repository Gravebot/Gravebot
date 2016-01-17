import bodyParser from 'body-parser';
import chalk from 'chalk';
import express from 'express';
import fs from 'fs';
import nconf from 'nconf';
import nib from 'nib';
import stylus from 'stylus';


function checkIP(req, res, next) {
  if (req.ip === '::ffff:127.0.0.1') return next();
  res.status(401);
}

const app = express();
app.use(bodyParser.json());

// Setup views endpoints
app.set('views', './web/views');
app.set('view engine', 'jade');
app.use(express.static('web'));

app.get('/style/:file', checkIP, (req, res) => {
  let file_name = `./web/styl/${req.params.file}`;
  if (fs.existsSync(file_name)) {
    stylus(fs.readFileSync(file_name, 'utf8'))
      .set('filename', file_name)
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
app.post('/view', checkIP, (req, res) => {
  // res.json({status: 'ok'});
  res.render(req.body.view, req.body.data);
});

// Health check endpoint
app.use('/', (req, res) => {
  res.json({status: 'okay'});
});

console.log(chalk.cyan(`Express listening on port ${nconf.get('PORT')}`));
app.listen(nconf.get('PORT'));
