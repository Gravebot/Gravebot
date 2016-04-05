import R from 'ramda';


function roll(client, e, suffix) {
  let times = suffix.split(' ')[0];
  let sides = suffix.split(' ')[1];

  if (!times) times = 1;
  if (!sides) sides = 6;

  if (isNaN(times) || isNaN(sides)) {
    return e.message.channel.sendMessage(`${e.message.author} rolled ${suffix}\nUsage: **\`!roll\`** \`times\` \`sides\``);
  }

  if (times > 1000 || sides > 1000000) {
    return e.message.channel.sendMessage(`${e.message.author} I\'m too high to calculate that high number.`);
  }

  let total = 0;
  let msg_array = R.map(num => {
    let number = Math.floor(Math.random() * sides) + 1;
    total += number;
    return number;
  }, R.range(0, Number(times)));

  const average = total / times;

  let return_text = `${e.message.author} rolled a ${sides} sided dice ${times} times for a total of **${total}** (average: ${average}):\n${msg_array}`;
  if (return_text.length >= 1999) {
    return e.message.channel.sendMessage(`${e.message.author} I\'m too high to calculate that high number.`);
  }

  e.message.channel.sendMessage(return_text);

  // Attempt clearing RAM early
  return_text = null;
  msg_array = null;
}

export default {
  dice: roll,
  roll
};

export const help = {
  roll: {parameters: ['times', 'sides']}
};
