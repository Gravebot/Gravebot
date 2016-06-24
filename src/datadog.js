import chalk from 'chalk';
import dogapi from 'dogapi';
import nconf from 'nconf';


if (nconf.get('DATADOG_APIKEY') && nconf.get('DATADOG_APPKEY')) {
  console.log(chalk.green('Datadog enabled'));
  dogapi.initialize({
    api_key: nconf.get('DATADOG_APIKEY'),
    app_key: nconf.get('DATADOG_APPKEY')
  });
}

export default function send(metric, value) {
  if (dogapi.client.api_key && dogapi.client.app_key) console.log('Submitting metrics');
  if (dogapi.client.api_key && dogapi.client.app_key) dogapi.metric.send(metric, value);
}
