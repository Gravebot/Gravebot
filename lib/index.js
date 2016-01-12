import glob from 'glob';
import R from 'ramda';


let glob_options = {
  realpath: true,
  nodir: true
};

let command_files = R.flatten([
  glob.sync('./lib/*(!(index.js|helpers.js))', glob_options),
  glob.sync('./lib/*/index.js', glob_options)
]);

// Merge all the commands objecs together and export.
let commands = R.mergeAll(R.map(js_path => {
  return require(js_path).default;
}, command_files));

export default commands;
