import { eightball } from '../../data';
import T from '../../translate';


function eightBall(client, e, suffix) {
  if (!suffix) {
    e.message.channel.sendMessage(`${T('8ball_usage', e.message.author.lang)}\nhttp://i.imgur.com/PcXHbt6.gif`);
  } else {
    const rand = Math.floor(Math.random() * eightball.length);
    e.message.channel.sendMessage(`:crystal_ball:**${eightball[rand]}**:crystal_ball:`);
  }
}

export default {
  '8ball': eightBall,
  eightball: eightBall
};

export const help = {
  '8ball': {
    parameters: ['question']
  }
};
