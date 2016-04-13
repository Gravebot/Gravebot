import T from '../../translate';


function joinServer(client, e, lang) {
  e.message.channel.sendMessage(T('join', lang) + '\nlink');
}

export default {
  invite: joinServer,
  join: joinServer,
  joinserver: joinServer,
  'join-server': joinServer
};

export const help = {
  join: {}
};
