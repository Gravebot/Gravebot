import Promise from 'bluebird';
import R from 'ramda';


function roll(client, evt, suffix) {
  let times = suffix.split(' ')[0];
  let sides = suffix.split(' ')[1];

  if (!times) times = 1;
  if (!sides) sides = 6;

  if (isNaN(times) || isNaN(sides)) {
    return Promise.resolve(`${evt.message.author.mention} rolled ${suffix}\nUsage: **\`!roll\`** \`times\` \`sides\``);
  }

  if (times > 1000 || sides > 1000000) {
    return Promise.resolve(`${evt.message.author.mention} I\'m too high to calculate that high number.`);
  }

  let total = 0;
  let msg_array = R.map(num => {
    let number = Math.floor(Math.random() * sides) + 1;
    total += number;
    return number;
  }, R.range(0, Number(times)));

  const average = total / times;


  let return_text = `${evt.message.author.mention} rolled a ${sides} sided dice ${times} times for a total of **${total}** (average: ${average}):\n${msg_array}`;
  // Attempt clearing RAM early
  msg_array = null;

  if (return_text.length >= 1999) {
    return Promise.resolve(`${evt.message.author.mention} I\'m too high to calculate that high number.`);
  }
  return Promise.resolve(return_text);
}

export default {
  dice: roll,
  roll
};

export const help = {
  roll: {parameters: ['times', 'sides']}
};
