import Promise from 'bluebird';

import { eightball } from '../../data';
import T from '../../translate';


function eightBall(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(`${T('8ball_usage', lang)}\nhttp://i.imgur.com/PcXHbt6.gif`);

  const rand = Math.floor(Math.random() * eightball.length);
  return Promise.resolve(`🎱 **${eightball[rand]}** 🎱`);
}

export default {
  '8ball': eightBall,
  eightball: eightBall
};

export const help = {
  '8ball': {parameters: 'question'}
};
