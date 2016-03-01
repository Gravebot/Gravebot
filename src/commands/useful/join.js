import T from '../../translate';


function joinServer(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, T('join_usage', msg.author.lang));
    return;
  }
  bot.joinServer(suffix, (err, server) => {
    if (err) {
      bot.sendMessage(msg.channel, `Failed to join: ${err}`);
    } else {
      bot.sendMessage(msg.channel, `Successfully joined ${server}`);
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
