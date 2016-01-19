import Promise from 'bluebird';
import chalk from 'chalk';
import Horseman from 'node-horseman';
import nconf from 'nconf';
import { path as phantom_path } from 'phantomjs2';
import Queue from 'promise-queue';
import R from 'ramda';


// Initialize PhantomJS
let options = {
  phantomPath: phantom_path,
  injectJquery: false
};

if (process.env.DEBUG && R.contains(process.env.DEBUG.indexOf('horseman') > -1)) {
  console.log(chalk.cyan('Phantom web inspector running on 9000'));
  options.debugPort = 9000;
}

const horseman = new Horseman(options)
  .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36')
  .headers({'Content-Type': 'application/json'});

// Initialize Queue
Queue.configure(Promise);
const queue = new Queue(1, Infinity);

export default function addQueue(view, data, width = 1920, height = 1080) {
  return queue.add(function() {
    let start = new Date().getTime();

    return horseman
      .viewport(width, height)
      .post(`http://127.0.0.1:${nconf.get('PORT')}/view`, JSON.stringify({view, data}))
      .screenshotBase64('PNG')
      .then(b64 => {
        let buf = new Buffer(b64, 'base64');
        let end = new Date().getTime();
        console.log(`${chalk.yellow('Phantom')} execution time: ${end - start}ms`);
        return buf;
      });
  });
}
