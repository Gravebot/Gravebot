import nconf from 'nconf';
import R from 'ramda';
import T from '../../translate';


const permissions = [
  '0x0000002', // Kick Members
  '0x0000004', // Ban Members
  '0x0000010', // Manage Channels
  '0x0000400', // Read Messages
  '0x0000800', // Send Messages
  '0x0002000', // Manage messages
  '0x0004000', // Embed Links,
  '0x0008000', // Attach files
  '0x0010000', // Read message history
  '0x10000000' // Manage Roles
];

const permission_value = R.sum(R.map(parseInt, permissions));
const join_link = `https://discordapp.com/oauth2/authorize?&client_id=${nconf.get('CLIENT_ID')}&scope=bot&permissions=${permission_value}`;

function joinServer(client, evt, suffix, lang) {
  evt.message.reply(`${T('join_link', lang)}\n${join_link}`);
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
