import Promise from 'bluebird';
import defineword from 'define-word';
import R from 'ramda';

import T from '../../translate';


function define(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('define_usage', lang));
  const word = defineword.define(suffix);
  if (!word.definitions.length) return Promise.resolve(`${T('define_error', lang)}: ${suffix}`);
  let text = '';
  text += suffix + ' is a ' + word.type + '\n';
  R.forEach(definition => {
    text += definition + '\n';
  }, word.definitions);
  return Promise.resolve(text);
}

function synonyms(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('synonym_usage', lang));
  const word = defineword.synonyms(suffix);
  if (!defineword.synonyms(suffix)) return Promise.resolve(`I couldn\'t find a synonym for: ${suffix}`);
  let text = '';
  text += suffix + ' synonyms:\n';
  R.forEach(word => {
    text += R.join(', ', word);
  }, word.length);
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
