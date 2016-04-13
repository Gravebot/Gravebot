import R from 'ramda';
import Wiki from 'wikijs';

import T from '../../translate';


function wiki(client, e, suffix, lang) {
  if (!suffix) {
    e.message.channel.sendMessage(T('wiki_usage', lang));
    return;
  }
  new Wiki().search(suffix, 1).then(data => {
    new Wiki().page(data.results[0]).then(page => {
      page.summary().then(summary => {
        const sum_text = summary.toString().split('\n');
        R.forEach(paragraph => {
          e.message.channel.sendMessage(paragraph);
        }, sum_text);
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
