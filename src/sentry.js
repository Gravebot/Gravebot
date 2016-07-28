import logger from './logger';
import nconf from 'nconf';
import raven from 'raven';


let client = {
  captureError: (err, options) => {
    if (options.tags && options.tags.source && !err.source) err.source = options.tags.source;
    logger.error(err.stack || err);
  }
};

if (nconf.get('NODE_ENV') === 'production' && nconf.get('SENTRY_DSN')) {
  logger.info('Sentry Enabled');
  client = new raven.Client(nconf.get('SENTRY_DSN'));

  client.on('error', err => logger.error(err));
  process.on('uncaughtException', err => {
    const exit = function() { process.exit(1); };
    const options = {
      level: 'fatal',
      source: 'main_process'
    };
    client.once('logged', exit);
    client.once('error', exit);
    client.captureError(err, options);
  });
}

export default function captureError(err, source) {
  if (!(err instanceof Error)) err = new Error(err);

  const options = {
    tags: {source}
  };

  if (nconf.get('SHARDING') && nconf.get('SHARD_NUMBER')) options.tags.shard_number = nconf.get('SHARD_NUMBER');
  if (err.level) options.level = err.level;
  if (err.level && err.level === 'warning') return;

  client.captureError(err, options);
}
