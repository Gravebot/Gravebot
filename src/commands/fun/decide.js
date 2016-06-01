import Promise from 'bluebird';

import { choices } from '../../data';
import T from '../../translate';


function decide(client, evt, suffix, lang) {
  function multipleDecide(options) {
    const selected = options[Math.floor(Math.random() * options.length)];
    if (!selected) return multipleDecide(options);
    return selected;
  }

  const split = suffix.split(` or `);
  const rand = Math.floor(Math.random() * choices.length);
  if (split.length > 1) return Promise.resolve(`${choices[rand]} **${multipleDecide(split)}**`);

  return Promise.resolve(T('decide_usage', lang));
}

export default {
  choice: decide,
  choose: decide,
  decide
};

export const help = {
  decide: {
    parameters: ['something', 'or', 'something']
  }
};
