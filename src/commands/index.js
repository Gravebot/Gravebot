import glob from 'glob';
import R from 'ramda';


const glob_options = {
  realpath: true,
  nodir: true
};

export const command_files = R.uniq(R.flatten([
  glob.sync(`${__dirname}/*(!(index.js))`, glob_options),
  glob.sync(`${__dirname}/*/index.js`, glob_options),
  glob.sync(`${__dirname}/*/*/index.js`, glob_options),
  glob.sync(`${__dirname}/*(!(help))/*.js`, glob_options)
]));

// Merge all the commands objecs together and export.
const commands = R.mergeAll(R.map(js_path => {
  return require(js_path).default;
}, command_files));

export default commands;
