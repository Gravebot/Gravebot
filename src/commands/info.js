import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';

import T from '../translate';

const request = Promise.promisify(require('request'));


function avatar(client, evt, suffix) {
  if (!suffix && !evt.message.mentions.length) {
    if (!evt.message.author.avatarURL) return Promise.resolve('You are naked.');
    return Promise.resolve(`Your avatar:\n${evt.message.author.avatarURL}`);
  } else if (evt.message.mentions.length) {
    return Promise.resolve(evt.message.mentions)
      .map(user => {
        if (!user.avatarURL) return `${user.username} is naked.`;
        return `${user.username}'s avatar:\n${user.avatarURL}`;
      });
  }
  const user = R.find(R.propEq('username', suffix))(evt.message.guild.members);
  if (!user) return;
  if (!user.avatarURL) return Promise.resolve(`${user.username} is naked.`);
  return Promise.resolve(`${user.username}'s avatar:\n${user.avatarURL}`);
}

function channelinfo(client, evt, suffix) {
  const channelinfo = [];
  if (evt.message.channel.is_private) {
    channelinfo.push(`\`\`\`ID: ${evt.message.channel.id}
Type: Direct Message
New Messages: ${evt.message.channel.messages.length} (since the bot was restarted)
Created At: ${evt.message.channel.createdAt}
\`\`\``);
  } else if (!suffix && evt.message.content.indexOf('<#') === -1) {
    channelinfo.push(`\`\`\`Server: ${evt.message.guild.name}
Name: ${evt.message.channel.name}
ID: ${evt.message.channel.id}
Type: ${evt.message.channel.type}
Position: ${evt.message.channel.position}
New Messages: ${evt.message.channel.messages.length} (since the bot was restarted)
Created At: ${evt.message.channel.createdAt}
Topic: ${evt.message.channel.topic}
\`\`\``);
  } else if (evt.message.content.indexOf('<#') !== -1) {
    R.forEach(suffix => {
      const channel = R.find(R.propEq('id', suffix.substring(2, suffix.length - 1)))(evt.message.guild.channels);
      if (channel.type === 'text') {
        channelinfo.push(`\`\`\`Server: ${channel.guild.name}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
New Messages: ${channel.messages.length} (since the bot was restarted)
Created At: ${channel.createdAt}
Topic: ${channel.topic}
\`\`\``);
      } else {
        channelinfo.push(`\`\`\`Server: ${channel.guild.name}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
Created At: ${channel.createdAt}
Bitrate: ${channel.bitrate}
\`\`\``);
      }
    }, suffix.split(' '));
  } else {
    const channel = R.find(R.propEq('name', suffix))(evt.message.guild.channels);
    if (!channel) return;
    if (channel.type === 'text') {
      channelinfo.push(`\`\`\`Server: ${channel.guild.name}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
New Messages: ${channel.messages.length} (since the bot was restarted)
Created At: ${channel.createdAt}
Topic: ${channel.topic}
\`\`\``);
    } else {
      channelinfo.push(`\`\`\`Server: ${channel.guild.name}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
Created At: ${channel.createdAt}
Bitrate: ${channel.bitrate}
\`\`\``);
    }
  }

  return Promise.resolve(channelinfo);
}

function feedback(client, evt, suffix, lang) {
  if (!nconf.get('FEEDBACK_CHANNEL')) return Promise.resolve(T('feedback_setup', lang));
  if (!suffix) return Promise.resolve(T('feedback_usage', lang));
  client.Channels.find(channel => channel.id === nconf.get('FEEDBACK_CHANNEL')).sendMessage(`**(${evt.message.author.username}) [${evt.message.author.id}]\n(${evt.message.guild.name}) [${evt.message.guild.id}]**\n${suffix.replace(/([@#*_~`])/g, '\\$1')}`);
}

function ping() {
  const start = process.hrtime();
  return Promise.resolve('Pong!').then(() => {
    const diff = process.hrtime(start);
    return `Pong!\n${(diff[0] * 1000) + (diff[1] / 1000000)}ms`;
  });
}

function serverinfo(client, evt, suffix) {
  const serverinfo = [];
  if (evt.message.channel.is_private) return Promise.resolve('Use this in an actual server.\nhttp://fat.gfycat.com/GranularWeeCorydorascatfish.gif');
  if (!suffix) {
    const roles = R.join(', ', R.remove(0, 1, R.pluck('name', evt.message.guild.roles)));
    serverinfo.push(`\`\`\`Name: ${evt.message.guild.name}
ID: ${evt.message.guild.id}
Region: ${evt.message.guild.region}
Owner: ${evt.message.guild.owner.username}
Channels: ${evt.message.guild.channels.length} (${evt.message.guild.textChannels.length} text & ${evt.message.guild.voiceChannels.length} voice)
Default Channel: ${evt.message.guild.generalChannel.name}
AFK Channel: ${evt.message.guild.afk_channel ? evt.message.guild.afk_channel.name : 'None'}
AFK Timeout: ${evt.message.guild.afk_timeout / 60} minutes
Members: ${evt.message.guild.members.length}
Created At: ${evt.message.guild.createdAt}
Roles: ${roles}
Icon: ${evt.message.guild.iconURL ? evt.message.guild.iconURL : 'None'}
\`\`\``);
  } else {
    const guild = R.find(R.propEq('name', suffix))(client.Guilds);
    if (!guild) return;
    const roles = R.join(', ', R.remove(0, 1, R.pluck('name', guild.roles)));
    serverinfo.push(`\`\`\`Name: ${guild.name}
ID: ${guild.id}
Region: ${guild.region}
Owner: ${guild.owner.username}
Channels: ${guild.channels.length} (${guild.textChannels.length} text & ${guild.voiceChannels.length} voice)
Default Channel: ${guild.generalChannel.name}
AFK Channel: ${guild.afk_channel.name ? guild.afk_channel.name : 'None'}
AFK Timeout: ${guild.afk_timeout / 60} minutes
Members: ${guild.members.length}
Created At: ${guild.createdAt}
Roles: ${roles}
Icon: ${guild.iconURL ? guild.iconURL : 'None'}
\`\`\``);
  }

  return Promise.resolve(serverinfo);
}

function servers(client) {
  return Promise.resolve(`Connected to ${client.Guilds.length} servers, ${client.Channels.length} channels and ${client.Users.length} users.`);
}

function userinfo(client, evt, suffix) {
  const userinfo = [];
  if (evt.message.channel.is_private) {
    userinfo.push(`\`\`\`Name: ${evt.message.author.username}
ID: ${evt.message.author.id}
Discriminator: ${evt.message.author.discriminator}
Status: ${evt.message.author.status} ${evt.message.author.gameName ? '(Playing ' + evt.message.author.gameName + ')' : ''}
Registered At: ${evt.message.author.registeredAt}
Avatar: ${evt.message.author.avatarURL ? evt.message.author.avatarURL : 'None'}
\`\`\``);
  } else if (!suffix && !evt.message.mentions.length) {
    userinfo.push(`\`\`\`Name: ${evt.message.author.username}
ID: ${evt.message.author.id}
Discriminator: ${evt.message.author.discriminator}
Status: ${evt.message.author.status} ${evt.message.author.gameName ? '(Playing ' + evt.message.author.gameName + ')' : ''}
Registered At: ${evt.message.author.registeredAt}
Avatar: ${evt.message.author.avatarURL ? evt.message.author.avatarURL : 'None'}
\`\`\``);
  } else if (evt.message.mentions.length) {
    R.forEach(user => {
      userinfo.push(`\`\`\`Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status} ${user.gameName ? '(Playing ' + user.gameName + ')' : ''}
Registered At: ${user.registeredAt}
Avatar: ${user.avatarURL ? user.avatarURL : 'None'}
\`\`\``);
    }, evt.message.mentions);
  } else {
    const user = R.find(R.propEq('username', suffix))(evt.message.guild.members);
    if (!user) return;
    userinfo.push(`\`\`\`Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status} ${user.gameName ? '(Playing ' + user.gameName + ')' : ''}
Registered At: ${user.registeredAt}
Avatar: ${user.avatarURL ? user.avatarURL : 'None'}
\`\`\``);
  }

  return Promise.resolve(userinfo);
}

function uptime() {
  const uptimeh = Math.floor(process.uptime() / (60 * 60));
  const uptimem = Math.floor(process.uptime() % (60 * 60) / 60);
  const uptimes = Math.floor(process.uptime() % 60);
  return Promise.resolve(`I have been alive for:
${uptimeh} Hours
${uptimem} Minutes
${uptimes} Seconds`);
}

function version() {
  return request('https://raw.githubusercontent.com/Gravebot/Gravebot/master/CHANGELOG.md')
    .then(R.prop('body'))
    .then(R.split(/<a name="*.*.*" \/>/g))
    .then(R.nth(1))
    .then(R.replace(/#### /g, ''))
    .then(R.replace(/#/g, ''))
    .then(R.slice(1, -1))
    .then(R.trim);
}

export default {
  avatar,
  channelinfo,
  changelog: version,
  'change-log': version,
  feedback,
  newfeatures: version,
  'new-features': version,
  ping,
  serverinfo,
  servers,
  statistics: servers,
  stats: servers,
  userinfo,
  uptime,
  version,
  whois: userinfo
};

export const help = {
  avatar: {parameters: ['username'], category: 'info'},
  channelinfo: {parameters: ['channelname'], category: 'info'},
  feedback: {parameters: ['text'], category: 'info'},
  ping: {category: 'info'},
  serverinfo: {parameters: ['servername'], category: 'info'},
  servers: {category: 'info'},
  userinfo: {parameters: ['username'], category: 'info'},
  uptime: {category: 'info'},
  version: {category: 'info'}
};
