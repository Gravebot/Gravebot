import Promise from 'bluebird';
import R from 'ramda';

const request = Promise.promisify(require('request'));


function version() {
  return request('https://raw.githubusercontent.com/Gravebot/Gravebot/master/CHANGELOG.md')
    .then(R.prop('body'))
    .then(R.split(/<a name="*.*.*" \/>/g))
    .then(R.nth(1))
    .then(R.replace(/#### /g, ''))
    .then(R.replace(/#/g, ''))
    .then(R.slice(1, -1))
    .then(R.trim);
}

export default {
  changelog: version,
  'change-log': version,
  newfeatures: version,
  'new-features': version,
  version
};

export const help = {
  version: {}
};
