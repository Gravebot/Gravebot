import bunyan from 'bunyan';
import chalk from 'chalk';
import moment from 'moment';
import nconf from 'nconf';
import R from 'ramda';

const production = (nconf.get('NODE_ENV') === 'production');
const config = {name: 'gravebot'};
if (nconf.get('SHARDING') && nconf.get('SHARD_NUMBER')) config.shard_number = nconf.get('SHARD_NUMBER');
const logger = bunyan.createLogger(config);


function _submitToLogger(type, msg) {
  if (R.is(Object, msg)) return logger[type](msg, msg.message || '');
  return logger[type](msg);
}

function cmd(cmd, suffix) {
  if (production) return logger.info({cmd, suffix}, 'cmd');
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.bold.green('[COMMAND]'), chalk.bold.green(cmd), suffix);
}

function info(msg) {
  if (production) return _submitToLogger('info', msg);
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), msg);
}

function warn(msg) {
  if (production) return _submitToLogger('warn', msg);
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.yellow(`[WARN] ${msg}`));
}

function error(msg) {
  if (production) return _submitToLogger('error', msg);
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.red(`[ERROR] ${msg}`));
}


export default {cmd, info, warn, error};
