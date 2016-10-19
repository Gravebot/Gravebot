import glob from 'glob';
import nconf from 'nconf';
import R from 'ramda';

import '../src/init-config';
import '../src/redis';
import startExpress from '../src/express';
import { init as initPhantom } from '../src/phantom';


// Defaults
startExpress();
initPhantom();
nconf.set('CLIENT_ID', '123');

const glob_options = {
  realpath: true,
  nodir: true
};

const test_files = R.flatten([
  glob.sync('./tests/*/*.js', glob_options),
  glob.sync('./tests/*(!(index.js))', glob_options)
]);

R.forEach(test_case => require(test_case), test_files);
