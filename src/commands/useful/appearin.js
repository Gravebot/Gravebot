import R from 'ramda';


function appearin(client, e) {
  const id = Math.random().toString().replace('.', '').slice(0, 10);
  const url = `https://appear.in/${id}`;

  // If no mentions, send link back to channel.
  if (!e.message.mentions.length) return e.message.channel.sendMessage(url);

  // Send url back to author and mentioned users
  e.message.author.sendMessage(url);
  R.forEach(user => e.message.user.sendMessage(`${e.message.author.name} would like you to join a videocall/screenshare.\n${url}`), e.message.mentions);
}

export default {
  appearin,
  ss: appearin,
  videocall: appearin,
  videochat: appearin
};

export const help = {
  videocall: {
    parameters: ['@username']
  }
};
