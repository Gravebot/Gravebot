import T from '../../translate';


function joinServer(client, e, suffix) {
  if (!suffix) {
    e.message.channel.sendMessage(T('join_usage', e.message.author.lang));
    return;
  }
  client.InviteManager.accept(suffix, (err, server) => {
    if (err) {
      e.message.channel.sendMessage(`Failed to join: ${err}`);
    } else {
      e.message.channel.sendMessage(`Successfully joined ${server}`);
    }
  });
}

export default {
  invite: joinServer,
  join: joinServer,
  joinserver: joinServer,
  'join-server': joinServer
};

export const help = {
  join: {parameters: 'invitation link'}
};
