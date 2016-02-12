import { eightball } from '../../data';


function eightBall(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, `${msg.author} You call that a question?\nhttp://i.imgur.com/PcXHbt6.gif`);
  } else {
    const rand = Math.floor(Math.random() * eightball.length);
    bot.sendMessage(msg.channel, `${msg.author}:crystal_ball:**${eightball[rand]}**:crystal_ball:`);
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
