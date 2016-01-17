const chalk = require('chalk');
console.log(chalk.cyan('Booting...'));

require('babel-register');
require('./server');
