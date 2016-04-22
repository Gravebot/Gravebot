import Promise from 'bluebird';
import Wiki from 'wikijs';

import T from '../../translate';


function wiki(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('wiki_usage', lang));

  return new Promise(resolve => {
    new Wiki().search(suffix, 1).then(data => {
      new Wiki().page(data.results[0]).then(page => {
        page.summary().then(summary => {
          resolve(summary.toString().split('\n'));
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
  wiki: {parameters: ['search terms']}
};
