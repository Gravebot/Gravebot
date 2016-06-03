import Promise from 'bluebird';
import defineword from 'define-word';
// import R from 'ramda';

import T from '../../translate';


function define(suffix, lang) {
  if (!suffix) return Promise.resolve(T('define_usage', lang));
  let word = defineword.define(suffix);
  if (!word.definitions.length) return Promise.resolve(`${T('define_error', lang)}: ${suffix}`);
  let text = '';
  text += suffix + ' is a ' + word.type + '\n';
  for (let i = 0; i < word.definitions.length; i++) {
    text += i + 1 + '. ' + word.definitions[i] + '\n';
  }
  return Promise.resolve(text);
}

function synonym(suffix, lang) {
  if (!suffix) return Promise.resolve(T('synonym_usage', lang));
  let word = defineword.synonyms(suffix);
  console.log(word.length);
  if (!defineword.synonyms(suffix)) return Promise.resolve(`I couldn\'t find a synonym for: ${suffix}`);
  let text = '';
  text += suffix + ' synonyms:\n';
  for (let i = 0; i < word.length; i++) {
    text += word[i] + ', ';
  }
  return Promise.resolve(text);
}

export default {
  d: define,
  define,
  synonym,
  synonyms: synonym
};

export const help = {
  define: {parameters: ['word']},
  synonym: {parameters: ['word']}
};
