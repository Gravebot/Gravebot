import Promise from 'bluebird';
import Wiki from 'wikijs';

import T from '../../translate';


function wiki(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('wiki_usage', lang));

  return new Promise(resolve => {
    Wiki().search(suffix, 1).then(data => {
      Wiki().page(data.results[0]).then(page => {
        page.summary().then(summary => {
          resolve(`${summary.substring(0, 1900)}...\n\n<${page.raw.fullurl}>`);
        });
      })
      .catch(() => {
        resolve(`${T('wiki_error', lang)} **${suffix}**`);
      });
    });
  });
}

export default {
  wiki,
  wikipedia: wiki
};

export const help = {
  wiki: {parameters: 'search terms'}
};
