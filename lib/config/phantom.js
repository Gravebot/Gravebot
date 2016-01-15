import Promise from 'bluebird';
import Horseman from 'node-horseman';
import nconf from 'nconf';
import { path as phantom_path } from 'phantomjs2';
import Queue from 'promise-queue';


// Initialize PhantomJS
const horseman = new Horseman({phantomPath: phantom_path, injectJquery: false})
  .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36');

// Initialize Queue
Queue.configure(Promise);
const queue = new Queue(1, Infinity);

export default function addQueue(view, data, width = 1920, height = 1080) {
  return queue.add(function() {
    let start = new Date().getTime();

    return horseman
      .viewport(width, height)
      .headers({Accept: 'application/json', 'Content-Type': 'application/json'})
      .post(`http://127.0.0.1:${nconf.get('PORT')}/view`, JSON.stringify({view, data}))
      .screenshotBase64('PNG')
      .then(b64 => { // TODO: remove
        let buf = new Buffer(b64, 'base64');
        let end = new Date().getTime();
        let time = end - start;
        console.log(`Execution time: ${time}`);
        return buf;
      });
  });
}
