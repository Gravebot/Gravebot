import Promise from 'bluebird';
import R from 'ramda';
import _request from 'request';

import sentry from '../sentry';


const request = Promise.promisify(_request);

function avatar(client, e, suffix) {
  if (!e.message.mentions.length) {
    if (!e.message.author.avatarURL) {
      e.message.channel.sendMessage('You are naked.');
    } else {
      e.message.channel.sendMessage(`Your avatar:\n${e.message.author.avatarURL}`);
    }
  } else {
    R.forEach(user => {
      if (!user.avatarURL) {
        e.message.channel.sendMessage(`${user.username} is naked.`);
      } else {
        e.message.channel.sendMessage(`${user.username}'s avatar:\n${user.avatarURL}`);
      }
    }, e.message.mentions);
  }
}

function channelinfo(client, e, suffix) {
  if (e.message.channel.is_private) {
    const channelinfo = (`\`\`\`ID: ${e.message.channel.id}
Type: Direct Message
New Messages: ${e.message.channel.messages.length} (since the bot was restarted)
Created At: ${e.message.channel.createdAt}
\`\`\``);
    e.message.channel.sendMessage(channelinfo);
  } else if (!suffix) {
    const channelinfo = (`\`\`\`Server: ${e.message.guild.name}
Name: ${e.message.channel.name}
ID: ${e.message.channel.id}
Type: ${e.message.channel.type}
Position: ${e.message.channel.position}
New Messages: ${e.message.channel.messages.length} (since the bot was restarted)
Created At: ${e.message.channel.createdAt}
Topic: ${e.message.channel.topic}
\`\`\``);
    e.message.channel.sendMessage(channelinfo);
  } else if (e.message.content.indexOf('<#') !== -1) {
    R.forEach(suffix => {
      let channel = client.Channels.get(suffix.substring(2, suffix.length - 1));
      if (channel.type === 'text') {
        const channelinfo = (`\`\`\`Server: ${channel.guild.name}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
New Messages: ${channel.messages.length} (since the bot was restarted)
Created At: ${channel.createdAt}
Topic: ${channel.topic}
\`\`\``);
        e.message.channel.sendMessage(channelinfo);
      } else {
        const channelinfo = (`\`\`\`Server: ${channel.guild.name}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
Created At: ${channel.createdAt}
Bitrate: ${channel.bitrate}
\`\`\``);
        e.message.channel.sendMessage(channelinfo);
      }
    }, suffix.split(' '));
  }
}

function ping(client, e) {
  let time = process.hrtime();
  setTimeout(() => {
    let diff = process.hrtime(time);
    e.message.channel.sendMessage(`Pong!\n${(diff[0] * 1000) + (diff[1] / 1000000)}ms`);
  }, 1);
}

function serverinfo(client, e) {
  if (e.message.channel.is_private) {
    e.message.channel.sendMessage('Use this in an actual server.\nhttp://fat.gfycat.com/GranularWeeCorydorascatfish.gif');
  } else {
    const roles = R.join(', ', R.remove(0, 1, R.pluck('name', e.message.guild.roles)));
    const serverinfo = (`\`\`\`Name: ${e.message.guild.name}
ID: ${e.message.guild.id}
Region: ${e.message.guild.region}
Owner: ${e.message.guild.owner.username}
Channels: ${e.message.guild.channels.length} (${e.message.guild.textChannels.length} text & ${e.message.guild.voiceChannels.length} voice)
Default Channel: ${e.message.guild.generalChannel.name}
AFK Channel: ${e.message.guild.afk_channel.name}
AFK Timeout: ${e.message.guild.afk_timeout / 60} minutes
Members: ${e.message.guild.members.length}
Created At: ${e.message.guild.createdAt}
Roles: ${roles}
Icon: ${e.message.guild.iconURL}
\`\`\``);
    e.message.channel.sendMessage(serverinfo);
  }
}

function servers(client, e) {
  e.message.channel.sendMessage(`Connected to ${client.Guilds.length} servers, ${client.Channels.length} channels and ${client.Users.length} users.`);
}

function userinfo(client, e, suffix) {
  if (e.message.channel.is_private) {
    const userinfo = (`\`\`\`Name: ${e.message.author.username}
ID: ${e.message.author.id}
Discriminator: ${e.message.author.discriminator}
Status: ${e.message.author.status} (${e.message.author.gameName})
Registered At: ${e.message.author.registeredAt}
Avatar: ${e.message.author.avatarURL}
\`\`\``);
    e.message.channel.sendMessage(userinfo);
  } else if (!e.message.mentions.length) {
    const userinfo = (`\`\`\`Name: ${e.message.author.username}
ID: ${e.message.author.id}
Discriminator: ${e.message.author.discriminator}
Status: ${e.message.author.status} (${e.message.author.gameName})
Registered At: ${e.message.author.registeredAt}
Avatar: ${e.message.author.avatarURL}
\`\`\``);
    e.message.channel.sendMessage(userinfo);
  } else {
    R.forEach(user => {
      const userinfo = (`\`\`\`Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status} (${user.gameName})
Registered At: ${user.registeredAt}
Avatar: ${user.avatarURL}
\`\`\``);
      e.message.channel.sendMessage(userinfo);
    }, e.message.mentions);
  }
}

function uptime(client, e) {
  const uptimeh = Math.floor(process.uptime() / (60 * 60));
  const uptimem = Math.floor(process.uptime() % (60 * 60) / 60);
  const uptimes = Math.floor(process.uptime() % 60);
  e.message.channel.sendMessage(`I have been alive for:
${uptimeh} Hours
${uptimem} Minutes
${uptimes} Seconds`);
}

function version(client, e) {
  request('https://raw.githubusercontent.com/Gravestorm/Gravebot/master/CHANGELOG.md')
    .then(R.prop('body'))
    .then(R.split(/<a name="*.*.*" \/>/g))
    .then(R.nth(1))
    .then(R.replace(/#### /g, ''))
    .then(R.replace(/#/g, ''))
    .then(R.slice(1, -1))
    .then(R.trim)
    .then(text => e.message.channel.sendMessage(text))
    .catch(err => {
      sentry(err, 'info', 'version');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

export default {
  avatar,
  channelinfo,
  changelog: version,
  'change-log': version,
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
  avatar: {parameters: ['@username'], category: 'info'},
  channelinfo: {parameters: ['#channelname'], category: 'info'},
  ping: {category: 'info'},
  serverinfo: {category: 'info'},
  servers: {category: 'info'},
  userinfo: {parameters: ['@username'], category: 'info'},
  uptime: {category: 'info'},
  version: {category: 'info'}
};
