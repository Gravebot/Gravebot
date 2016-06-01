import Promise from 'bluebird';
import T from '../../translate';

const uu = Promise.promisifyAll(require('url-unshort')({nesting: 3}));


function unshorten(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('unshorten_usage', lang));
  return uu.expandAsync(suffix)
    .then(url => {
      if (!url) return 'This url can\'t be expanded.';
      return `<${url}>`;
    });
}

export default {
  expand: unshorten,
  unshort: unshorten,
  unshorten
};

export const help = {
  unshorten: {parameters: 'url'}
};
