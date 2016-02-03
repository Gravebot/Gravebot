import glob from 'glob';
import R from 'ramda';

import '../lib/config/init';
import '../lib/config/express';
import '../lib/config/phantom';


const glob_options = {
  realpath: true,
  nodir: true
};

const test_files = R.flatten([
  glob.sync('./tests/*/*.js', glob_options),
  glob.sync('./tests/*(!(index.js))', glob_options)
]);

R.forEach(test_case => {
  require(test_case);
}, test_files);
