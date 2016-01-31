const chalk = require('chalk');
const moment = require('moment');
console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Booting...`));

require('babel-register');
require('./server');
