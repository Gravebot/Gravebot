import Promise from 'bluebird';
import R from 'ramda';
import _request from 'request';

import sentry from './config/sentry';


const request = Promise.promisify(_request);

function avatar(bot, msg, suffix) {
  if (msg.mentions.length === 0) {
    if (msg.author.avatarURL === null) return bot.sendMessage(msg.channel, 'You are naked.');
    return bot.sendMessage(msg.channel, `Your avatar:\n${msg.author.avatarURL}`);
  }
  const msg_array = R.map(user => {
    if (user.avatarURL === null) return `${user.username} is naked.`;
    return `${user.username}\'s avatar:\n${user.avatarURL}`;
  }, msg.mentions);
  bot.sendMessage(msg.channel, msg_array);
}

function serverinfo(bot, msg) {
  if (msg.channel.server) {
    const roles = R.join(', ', R.remove(0, 1, R.pluck('name', msg.channel.server.roles)));
    const serverinfo = (`\`\`\`Name: ${msg.channel.server.name}
ID: ${msg.channel.server.id}
Region: ${msg.channel.server.region}
Owner: ${msg.channel.server.owner.username}
Channels: ${msg.channel.server.channels.length}
Default Channel: ${msg.channel.server.defaultChannel.name}
AFK Channel: ${msg.channel.server.afkChannel ? msg.channel.server.afkChannel.name : null}
Members: ${msg.channel.server.members.length}
Roles: ${roles}
Icon: ${msg.channel.server.iconURL}
\`\`\``);
    bot.sendMessage(msg.channel, serverinfo);
  } else {
    const serverinfo = (`\`\`\`Name: ${bot.user.name}
ID: ${bot.user.id}
Region: Discord
Owner: ${bot.user.name}
Channels: 1
Default Channel: ${bot.user.name}
AFK Channel: ${bot.user.name}
Members: 2
Roles: @everyone
Icon: ${bot.user.avatarURL}
\`\`\``);
    bot.sendMessage(msg.channel, serverinfo);
  }
}

function serverlist(bot, msg) {
  const server_list = R.map(server => {
    const online = server.members.reduce((count, member) => count + (member.status === 'online' ? 1 : 0), 0);
    return `**\`${server.name}\`** ${server.members.length} members (${online} online)`;
  }, bot.servers.sort());
  bot.sendMessage(msg.channel, server_list.join('\n'));
}

function servers(bot, msg) {
  bot.sendMessage(msg.channel, `Connected to ${bot.servers.length} servers, ${bot.channels.length} channels and ${bot.users.length} users.`);
}

function userinfo(bot, msg, suffix) {
  if (msg.mentions.length === 0) {
    if (msg.channel.server) {
      const userinfo = (`\`\`\`Name: ${msg.author.username}
ID: ${msg.author.id}
Discriminator: ${msg.author.discriminator}
Status: ${msg.author.status}
Joined ${msg.channel.server.name}: ${new Date(msg.channel.server.detailsOfUser(msg.author).joinedAt).toUTCString()}
Avatar: ${msg.author.avatarURL}
\`\`\``);
      bot.sendMessage(msg.channel, userinfo);
    } else {
      const userinfo = (`\`\`\`Name: ${msg.author.username}
ID: ${msg.author.id}
Discriminator: ${msg.author.discriminator}
Status: ${msg.author.status}
Avatar: ${msg.author.avatarURL}
\`\`\``);
      bot.sendMessage(msg.channel, userinfo);
    }
  } else {
    R.forEach(user => {
      if (user != null) {
        const userinfo = (`\`\`\`Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status}
Joined ${msg.channel.server.name}: ${new Date(msg.channel.server.detailsOfUser(user).joinedAt).toUTCString()}
Avatar: ${user.avatarURL}
\`\`\``);
        bot.sendMessage(msg.channel, userinfo);
      }
    }, msg.mentions);
  }
}

function uptime(bot, msg) {
  const uptimeh = Math.floor((bot.uptime / 1000) / (60 * 60));
  const uptimem = Math.floor((bot.uptime / 1000) % (60 * 60) / 60);
  const uptimes = Math.floor((bot.uptime / 1000) % 60);
  bot.sendMessage(msg.channel, `I have been alive for:
${uptimeh} Hours
${uptimem} Minutes
${uptimes} Seconds`);
}

function version(bot, msg) {
  request('https://raw.githubusercontent.com/Gravestorm/Gravebot/master/CHANGELOG.md')
    .then(R.prop('body'))
    .then(R.split(/<a name="*.*.*" \/>/g))
    .then(R.nth(1))
    .then(R.replace(/#### /g, ''))
    .then(R.replace(/#/g, ''))
    .then(R.slice(1, -1))
    .then(R.trim)
    .then(text => bot.sendMessage(msg.channel, text))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

export default {
  avatar,
  changelog: version,
  'change-log': version,
  newfeatures: version,
  'new-features': version,
  serverinfo,
  serverlist,
  servers,
  statistics: servers,
  stats: servers,
  userinfo,
  uptime,
  version,
  whois: userinfo
};
