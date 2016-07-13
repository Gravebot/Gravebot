import Promise from 'bluebird';
import nconf from 'nconf';

import T from '../../translate';


function feedback(client, evt, suffix, lang) {
  if (!nconf.get('FEEDBACK_CHANNEL_ID')) return Promise.resolve(T('feedback_setup', lang));
  if (!suffix) return Promise.resolve(T('feedback_usage', lang));
  client.Channels.find(channel => channel.id === nconf.get('FEEDBACK_CHANNEL_ID')).sendMessage(`**(${evt.message.author.username}) [${evt.message.author.id}]\n(${evt.message.guild.name}) [${evt.message.guild.id}]**\n${suffix.replace(/([@#*_~`])/g, '\\$1')}`);
  evt.message.reply(T('feedback_reply', lang));
}

export default {
  feedback
};

export const help = {
  feedback: {parameters: ['text']}
};
