import Promise from 'bluebird';
import Horseman from 'node-horseman';
import nconf from 'nconf';
import { path as phantom_path } from 'phantomjs-prebuilt';
import Queue from 'promise-queue';
import R from 'ramda';

import datadog from './datadog';
import logger from './logger';
import sentry from './sentry';


// Initialize PhantomJS
let horseman;
const options = {
  phantomPath: phantom_path,
  injectJquery: false
};

if (process.env.DEBUG && R.contains(process.env.DEBUG.indexOf('horseman') > -1)) {
  logger.info('Phantom web inspector running on 9000');
  options.debugPort = 9000;
}

function createHorseman() {
  logger.info('Starting horseman/phantomjs');

  if (horseman) horseman.close();
  horseman = new Horseman(options)
    .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36')
    .headers({'Content-Type': 'application/json'});
  return horseman;
}

// Horseman at the moment doesn't verifying if the Phantom process is still running and doesn't recover when it does.
// This does a simple check every ~5 seconds, and if it timeouts the process is recreated.
// TODO: Make PR to horseman and fix it there rather then here.
function verifyPhantomProcess() {
  if (!horseman) return Promise.delay(5000);
  return horseman
    .url()
    .timeout(10000)
    .catch(Promise.TimeoutError, () => {
      logger.info('Phantomjs is not responding. Restarting process.');
      return createHorseman();
    })
    .delay(5000)
    .then(() => {
      verifyPhantomProcess();
    });
}

export function init() {
  // PhantomJS seems to have a problem in production where it stops rendering images after a certain period of time.
  // This reboots the PhantomJS process every 3 hours.
  setInterval(createHorseman, 10800000);
  createHorseman().then(verifyPhantomProcess);
}

// Initialize Queue
Queue.configure(Promise);
const queue = new Queue(1, Infinity);

export default function addQueue(view, data) {
  return queue.add(function() {
    const start = new Date().getTime();

    return horseman
      .viewport(1920, 1080)
      .post(`http://127.0.0.1:${nconf.get('PORT')}/view/${view}`, JSON.stringify(data))
      .then(() => Promise.join(horseman.width('.main'), horseman.height('.main')))
      .spread((width, height) => {
        const area = {top: 0, left: 0, width, height};
        return horseman
          .cropBase64(area, 'PNG')
          .then(b64 => {
            const buf = new Buffer(b64, 'base64');
            const execution_time = new Date().getTime() - start;
            datadog(`phantomjs.${view}.execution_time`, execution_time);
            logger.info(`Phantom execution time: ${execution_time}ms`);
            return buf;
          });
      })
      .timeout(8000)
      .catch(err => {
        sentry(err, 'phantom');
        return new Error('There was an error attempting to generate the image. Please try again.');
      });
  });
}
