import Promise from 'bluebird';
import urbanQuery from 'urban';

import T from '../../translate';


function urban(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('urban_usage', lang));

  return new Promise(resolve => {
    urbanQuery(suffix).first((json) => {
      if (json) {
        resolve(`${json.word}: ${json.definition}
  :arrow_up: ${json.thumbs_up}   :arrow_down: ${json.thumbs_down}

  Example: ${json.example}`);
      } else {
        resolve(`${T('urban_error', lang)}: ${suffix}`);
      }
    });
  });
}

export default {
  ud: urban,
  urban
};

export const help = {
  urban: {parameters: ['search terms']}
};
