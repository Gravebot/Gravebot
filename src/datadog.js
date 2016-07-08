import dogapi from 'dogapi';
import nconf from 'nconf';

import logger from './logger';


if (nconf.get('DATADOG_APIKEY') && nconf.get('DATADOG_APPKEY')) {
  logger.info('Datadog enabled');
  dogapi.initialize({
    api_key: nconf.get('DATADOG_APIKEY'),
    app_key: nconf.get('DATADOG_APPKEY')
  });
}

export default function send(metric, value) {
  if (dogapi.client.api_key && dogapi.client.app_key) dogapi.metric.send(metric, value);
}
