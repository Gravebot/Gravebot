import Promise from 'bluebird';
import chalk from 'chalk';
import Horseman from 'node-horseman';
import nconf from 'nconf';
import { path as phantom_path } from 'phantomjs-prebuilt';
import Queue from 'promise-queue';
import R from 'ramda';
import sentry from './sentry';


// Initialize PhantomJS
const options = {
  phantomPath: phantom_path,
  injectJquery: false
};

if (process.env.DEBUG && R.contains(process.env.DEBUG.indexOf('horseman') > -1)) {
  console.log(chalk.cyan('Phantom web inspector running on 9000'));
  options.debugPort = 9000;
}

// Initialize Queue
Queue.configure(Promise);
const queue = new Queue(1, Infinity);

export default function addQueue(view, data) {
  return queue.add(function() {
    const start = new Date().getTime();
    const horseman = new Horseman(options)
      .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36')
      .headers({'Content-Type': 'application/json'})
      .viewport(1920, 1080);

    return horseman
      .post(`http://127.0.0.1:${nconf.get('PORT')}/view/${view}`, JSON.stringify(data))
      .then(() => Promise.join(horseman.width('.main'), horseman.height('.main')))
      .spread((width, height) => {
        const area = {top: 0, left: 0, width, height};
        return horseman
          .cropBase64(area, 'PNG')
          .then(b64 => {
            horseman.close();
            const buf = new Buffer(b64, 'base64');
            const end = new Date().getTime();
            console.log(`${chalk.yellow('Phantom')} execution time: ${end - start}ms`);
            return buf;
          });
      })
      .timeout(8000)
      .catch(err => {
        sentry(err, 'phantom');
        horseman.close();
        throw new Error('There was an error attempting to generate the image. Please try again.');
      });
  });
}
