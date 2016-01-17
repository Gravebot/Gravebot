import glob from 'glob';
import nconf from 'nconf';
import R from 'ramda';
import '../lib/config/init';
import '../lib/config/express';
import '../lib/config/phantom';


nconf.set('PORT', 5000);

let glob_options = {
  realpath: true,
  nodir: true
};

R.forEach(test_case => {
  require(test_case);
}, glob.sync('./tests/*(!(index.js))', glob_options));
