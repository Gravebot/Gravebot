import R from 'ramda';


function roll(bot, msg, suffix) {
  let times = suffix.split(' ')[0];
  let sides = suffix.split(' ')[1];

  if (isNaN(times) || isNaN(sides)) {
    return bot.sendMessage(msg.channel, `${msg.author} rolled ${suffix}\nUsage: **\`!roll\`** \`times\` \`sides\``);
  }

  if (times > 1000 || sides > 1000000) {
    return bot.sendMessage(msg.channel, `${msg.author} I\'m too high to calculate that high number.`);
  }

  if (!times) times = 1;
  if (!sides) sides = 6;

  let total = 0;
  let msg_array = R.map(num => {
    let number = Math.floor(Math.random() * sides) + 1;
    total += number;
    return number;
  }, R.range(0, Number(times)));

  const average = total / times;

  let return_text = `${msg.author} rolled a ${sides} sided dice ${times} times for a total of **${total}** (average: ${average}):\n${msg_array}`;
  if (return_text.length >= 1999) {
    return bot.sendMessage(msg.channel, `${msg.author} I\'m too high to calculate that high number.`);
  }

  bot.sendMessage(msg.channel, return_text);

  // Attempt clearing RAM early
  return_text = null;
  msg_array = null;
}

export default {
  dice: roll,
  roll
};
