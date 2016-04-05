import Promise from 'bluebird';
import R from 'ramda';
import _request from 'request';

import sentry from '../sentry';


const request = Promise.promisify(_request);

function avatar(client, e, suffix) {
  if (!suffix && !e.message.mentions.length) {
    if (!e.message.author.avatarURL) {
      e.message.channel.sendMessage('You are naked.');
    } else {
      e.message.channel.sendMessage(`Your avatar:\n${e.message.author.avatarURL}`);
    }
  } else if (e.message.mentions.length) {
    R.forEach(user => {
      if (!user.avatarURL) {
        e.message.channel.sendMessage(`${user.username} is naked.`);
      } else {
        e.message.channel.sendMessage(`${user.username}'s avatar:\n${user.avatarURL}`);
      }
    }, e.message.mentions);
  } else {
    R.forEach(user => {
      if (!user.avatarURL) {
        e.message.channel.sendMessage(`${user.username} is naked.`);
      } else {
        e.message.channel.sendMessage(`${user.username}'s' avatar:\n${user.avatarURL}`);
      }
    }, client.UserCollection.getBy('name', suffix));
  }
}

function channelinfo(client, e, suffix) {
  if (e.message.channel.is_private) {
    if (!suffix) {
      const channelinfo = (`\`\`\`Name: ${client.User.name}
ID: ${e.message.DirectMessageChannel.id}
Type: Direct Message
New Messages: ${e.message.DirectMessageChannel.messages.length} (since the bot was restarted)
Created At: ${e.message.DirectMessageChannel.createdAt}
\`\`\``);
      e.message.channel.sendMessage(channelinfo);
    } else if (e.message.content.indexOf('<#') !== -1) {
      R.forEach(suffix => {
        R.forEach(channel => {
          if (channel.type === 'text') {
            const channelinfo = (`\`\`\`Server: ${channel.guild}
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
            const channelinfo = (`\`\`\`Server: ${channel.guild}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
Created At: ${channel.createdAt}
Bitrate: ${channel.bitrate}
\`\`\``);
            e.message.channel.sendMessage(channelinfo);
          }
        }, client.ChannelCollection.getBy('id', suffix.substring(2, suffix.length - 1)));
      }, suffix.split(' '));
    } else {
      R.forEach(channel => {
        if (channel.type === 'text') {
          const channelinfo = (`\`\`\`Server: ${channel.guild}
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
          const channelinfo = (`\`\`\`Server: ${channel.guild}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
Created At: ${channel.createdAt}
Bitrate: ${channel.bitrate}
\`\`\``);
          e.message.channel.sendMessage(channelinfo);
        }
      }, client.ChannelCollection.getBy('name', suffix));
    }
  } else if (!suffix) {
    const channelinfo = (`\`\`\`Server: ${e.message.channel.guild}
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
      R.forEach(channel => {
        if (channel.type === 'text') {
          const channelinfo = (`\`\`\`Server: ${channel.guild}
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
          const channelinfo = (`\`\`\`Server: ${channel.guild}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
Created At: ${channel.createdAt}
Bitrate: ${channel.bitrate}
\`\`\``);
          e.message.channel.sendMessage(channelinfo);
        }
      }, client.ChannelCollection.getBy('id', suffix.substring(2, suffix.length - 1)));
    }, suffix.split(' '));
  } else {
    R.forEach(channel => {
      if (channel.type === 'text') {
        const channelinfo = (`\`\`\`Server: ${channel.guild}
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
        const channelinfo = (`\`\`\`Server: ${channel.guild}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
Created At: ${channel.createdAt}
Bitrate: ${channel.bitrate}
\`\`\``);
        e.message.channel.sendMessage(channelinfo);
      }
    }, client.GuildCollection.getBy('id', e.message.channel.server.id).ChannelCollection.getBy('name', suffix));
  }
}

function ping(client, e) {
  let time = process.hrtime();
  setTimeout(() => {
    let diff = process.hrtime(time);
    e.message.channel.sendMessage(`Pong!\n${(diff[0] * 1000) + (diff[1] / 1000000)}ms`);
  }, 1);
}

function serverinfo(client, e, suffix) {
  if (suffix) {
    R.forEach(server => {
      const roles = R.join(', ', R.remove(0, 1, R.pluck('name', server.roles)));
      const serverinfo = (`\`\`\`Name: ${server.name}
ID: ${server.id}
Region: ${server.region}
Owner: ${server.owner}
Channels: ${server.channels.length} (${server.textChannels.length} text | ${server.voiceChannels.length} voice)
Default Channel: ${server.generalChannel.name}
AFK Channel: ${server.afk_channel}
Members: ${server.members.length}
Created At: ${server.createdAt}
Roles: ${roles}
Icon: ${server.iconURL}
  \`\`\``);
      e.message.channel.sendMessage(serverinfo);
    }, client.GuildCollection.getBy('name', suffix));
  } else if (e.message.channel.is_private) {
    const serverinfo = (`\`\`\`Name: ${client.User.name}
ID: ${client.User.id}
Region: Discord
Owner: ${client.User.name}
Channels: 1
Default Channel: ${client.User.name}
AFK Channel: ${client.User.name}
Members: 2
Created At: Soon™
Roles: @everyone
Icon: ${client.User.avatarURL}
\`\`\``);
    e.message.channel.sendMessage(serverinfo);
  } else if (!suffix) {
    const roles = R.join(', ', R.remove(0, 1, R.pluck('name', e.message.channel.server.roles)));
    const serverinfo = (`\`\`\`Name: ${e.message.channel.server.name}
ID: ${e.message.channel.server.id}
Region: ${e.message.channel.server.region}
Owner: ${e.message.channel.server.owner}
Channels: ${e.message.channel.server.channels.length} (${e.message.server.textChannels.length} text | ${e.message.server.voiceChannels.length} voice)
Default Channel: ${e.message.channel.server.generalChannel.name}
AFK Channel: ${e.message.channel.server.afk_channel}
Members: ${e.message.channel.server.members.length}
Created At: ${e.message.channel.server.createdAt}
Roles: ${roles}
Icon: ${e.message.channel.server.iconURL}
\`\`\``);
    e.message.channel.sendMessage(serverinfo);
  }
}
// ? e.message.channel.server.afkChannel.name : null
function servers(client, e) {
  e.message.channel.sendMessage(`Connected to ${client.GuildCollection.length} servers, ${client.ChannelCollection.length} channels and ${client.UserCollection.length} users.`);
}

function userinfo(client, e, suffix) {
  if (e.message.channel.is_private) {
    if (!suffix) {
      const userinfo = (`\`\`\`Name: ${e.message.author.username}
ID: ${e.message.author.id}
Discriminator: ${e.message.author.discriminator}
Status: ${e.message.author.status} (${e.message.author.gameName})
Created At: ${e.message.author.registeredAt}
Joined At: ${e.message.author.joinedAt}
Avatar: ${e.message.author.avatarURL}
\`\`\``);
      e.message.channel.sendMessage(userinfo);
    } else {
      R.forEach(user => {
        const userinfo = (`\`\`\`Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status} (${user.gameName})
Created At: ${user.registeredAt}
Joined At: ${user.joinedAt}
Avatar: ${user.avatarURL}
\`\`\``);
        e.message.channel.sendMessage(userinfo);
      }, client.UserCollection.getBy('name', suffix));
    }
  } else if (!suffix && !e.message.mentions.length) {
    const userinfo = (`\`\`\`Name: ${e.message.author.username}
ID: ${e.message.author.id}
Discriminator: ${e.message.author.discriminator}
Status: ${e.message.author.status} (${e.message.author.gameName})
Created At: ${e.message.author.registeredAt}
Joined At: ${e.message.author.joinedAt}
Avatar: ${e.message.author.avatarURL}
\`\`\``);
    e.message.channel.sendMessage(userinfo);
  } else if (e.message.mentions.length) {
    R.forEach(user => {
      const userinfo = (`\`\`\`Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status} (${user.gameName})
Created At: ${user.registeredAt}
Joined At: ${user.joinedAt}
Avatar: ${user.avatarURL}
\`\`\``);
      e.message.channel.sendMessage(userinfo);
    }, e.message.mentions);
  } else {
    R.forEach(user => {
      const userinfo = (`\`\`\`Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status} (${user.gameName})
Created At: ${user.registeredAt}
Joined At: ${user.joinedAt}
Avatar: ${user.avatarURL}
\`\`\``);
      e.message.channel.sendMessage(userinfo);
    }, client.GuildCollection.getBy('id', e.message.channel.server.id).UserCollection.getBy('name', suffix));
  }
}

function uptime(client, e) {
  const uptimeh = Math.floor((client.uptime / 1000) / (60 * 60));
  const uptimem = Math.floor((client.uptime / 1000) % (60 * 60) / 60);
  const uptimes = Math.floor((client.uptime / 1000) % 60);
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
  avatar: {parameters: ['username'], category: 'info'},
  channelinfo: {parameters: ['channel name'], category: 'info'},
  ping: {category: 'info'},
  serverinfo: {parameters: ['server name'], category: 'info'},
  servers: {category: 'info'},
  userinfo: {parameters: ['username'], category: 'info'},
  uptime: {category: 'info'},
  version: {category: 'info'}
};
