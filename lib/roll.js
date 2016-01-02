import R from 'ramda';

export default {
  roll: (bot, msg, suffix) => {
    let times = msg.content.split(' ')[1];
    let sides = msg.content.split(' ')[2];

    let max_msg = `${msg.author} I\'m too high to calculate that high number.`;
    if (times > 500 && sides > 500) {
      bot.sendMessage(msg.channel, max_msg);
    } else if (times > 900) {
      bot.sendMessage(msg.channel, max_msg);
    } else {
      if (!sides) sides = 6;
      if (!times) times = 1;

      var total = 0;
      let msg_array = R.map(num => {
        let number = Math.floor(Math.random() * sides) + 1;
        total += number;
        return number;
      }, R.range(0, Number(times)));

      let average = total / times;

      if (isNaN(times) || isNaN(sides)) {
        bot.sendMessage(msg.channel, `${msg.author} rolled ${suffix}\nUsage: **\`!roll\`** \`times\` \`sides\``);
        return;
      }
      bot.sendMessage(msg.channel, `${msg.author} rolled a ${sides} sided dice ${times} times for a total of ${total} (average: ${average}):\n${msg_array}`);
    }
  }
};
