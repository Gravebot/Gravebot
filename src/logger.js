import bunyan from 'bunyan';
import chalk from 'chalk';
import moment from 'moment';
import nconf from 'nconf';

const production = (nconf.get('NODE_ENV') === 'production');
const logger = bunyan.createLogger({name: 'gravebot'});


function cmd(cmd, suffix) {
  if (production) return logger.info({cmd, suffix}, 'cmd');
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.bold.green('[COMMAND]'), chalk.bold.green(cmd), suffix);
}

function info(msg) {
  if (production) return logger.info(msg);
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), msg);
}

function warn(msg) {
  if (production) return logger.error(msg);
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.yellow(`[WARN] ${msg}`));
}

function error(msg) {
  if (production) return logger.error(msg);
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.red(`[ERROR] ${msg}`));
}


export default {cmd, info, warn, error};
