import fs from 'fs';
import nconf from 'nconf';
import path from 'path';


// Config
nconf.use('memory');
nconf.argv().env();

const config_path = path.join(__dirname, '../config.js');
if (fs.existsSync(config_path)) {
  nconf.defaults(require(config_path));
}
