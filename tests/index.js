import glob from 'glob';
import R from 'ramda';
import '../lib/config/init';

let glob_options = {
  realpath: true,
  nodir: true
};

R.forEach(test_case => {
  require(test_case);
}, glob.sync('./tests/*(!(index.js))', glob_options));
