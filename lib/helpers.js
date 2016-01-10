import chalk from 'chalk';
import glob from 'glob';
import moment from 'moment';
import R from 'ramda';

export function mergeCommands(misc_commands) {
  let glob_options = {
    realpath: true,
    nodir: true
  };

  let command_files = R.flatten([
    glob.sync('./lib/*(!(index.js|helpers.js))', glob_options),
    glob.sync('./lib/*/index.js', glob_options)
  ]);

  let command_functions = R.map(js_path => {
    return require(js_path).default;
  }, command_files);

  return R.mergeAll(R.flatten([misc_commands, command_functions]));
}

export function callCmd(cmd, name, bot, msg, suffix) {
  console.log(`${chalk.blue('[' + moment().format('HH:mm:ss' + ']'))} ${chalk.bold.green(name)}: ${suffix}`);
  cmd(bot, msg, suffix);
}

export function getOrdinal(n) {
  let s = ['th', 'st', 'nd', 'rd'];
  let v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function secondDec(n) {
  return Math.round(n * 100) / 100;
}
