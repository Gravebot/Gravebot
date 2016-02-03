const chalk = require('chalk');
const moment = require('moment');
console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Booting...`));

if (process.env.DEV) {
  require('babel-register');
  require('./src/');
} else {
  require('./dist');
}
