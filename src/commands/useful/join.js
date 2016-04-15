import nconf from 'nconf';
import T from '../../translate';


function joinServer(client, e, suffix, lang) {
  e.message.channel.sendMessage(`${T('join_link', lang)}\n${nconf.get('JOIN_LINK')}`);
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
