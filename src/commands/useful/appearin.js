import Promise from 'bluebird';
import R from 'ramda';


function appearin(client, evt) {
  const id = Math.random().toString().replace('.', '').slice(0, 10);
  const url = `https://appear.in/${id}`;

  // If no mentions, send link back to channel.
  if (!evt.message.mentions.length) return Promise.resolve(url);

  // Send url back to author and mentioned users
  client.Users.get(evt.message.author.id).openDM().then(dm => dm.sendMessage(url));
  R.forEach(user => {
    client.Users.get(user.id).openDM().then(dm => dm.sendMessage(`${evt.message.author.username} would like you to join a videocall/screenshare.\n${url}`));
  }, evt.message.mentions);
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
