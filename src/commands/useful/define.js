import Promise from 'bluebird';
import defineword from 'define-word';
import R from 'ramda';

import T from '../../translate';


function define(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('define_usage', lang));
  const word = defineword.define(suffix);
  if (!word.definitions.length) return Promise.resolve(`${T('define_error', lang)}: ${suffix}`);
  const text = suffix + ' is a ' + word.type + '\n' + R.join(`\n`, R.addIndex(R.map)((word, idx) => idx + 1 + '.' + word, word.definitions));
  return Promise.resolve(text);
}

function synonyms(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('synonym_usage', lang));
  const word = defineword.synonyms(suffix);
  if (!word[0]) return Promise.resolve(`I couldn\'t find a synonym for: ${suffix}`);
  const text = suffix + ' synonyms:\n' + R.join(', ', word.sort());
  return Promise.resolve(text);
}

export default {
  d: define,
  define,
  definition: define,
  synonym: synonyms,
  synonyms
};

export const help = {
  define: {parameters: ['word']},
  synonym: {parameters: ['word']}
};
