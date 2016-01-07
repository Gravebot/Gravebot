import nconf from 'nconf';
import raven from 'raven';

let client = {
  captureError: (err) => console.log(err.message)
};

if (nconf.get('NODE_ENV') === 'production' && nconf.get('SENTRY_DSN')) {
  console.log('Sentry Enabled');
  client = new raven.Client(nconf.get('SENTRY_DSN'));

  client.on('error', err => console.log(`Error: ${err.message}`));
  process.on('uncaughtException', err => {
    const exit = function() { process.exit(1); };
    client.once('logged', exit);
    client.once('error', exit);
    client.captureError(err, {level: 'fatal'});
  });
}

export default client;
