import Promise from 'bluebird';
import R from 'ramda';
import _request from 'request';

import sentry from '../sentry';


const request = Promise.promisify(_request);

function avatar(bot, msg, suffix) {
  if (!suffix && !msg.mentions.length) {
    if (!msg.author.avatarURL) {
      bot.sendMessage(msg.channel, 'You are naked.');
    } else {
      bot.sendMessage(msg.channel, `Your avatar:\n${msg.author.avatarURL}`);
    }
  } else if (msg.mentions.length) {
    R.forEach(user => {
      if (!user.avatarURL) {
        bot.sendMessage(msg.channel, `${user.username} is naked.`);
      } else {
        bot.sendMessage(msg.channel, `${user.username}'s avatar:\n${user.avatarURL}`);
      }
    }, msg.mentions);
  } else {
    R.forEach(user => {
      if (!user.avatarURL) {
        bot.sendMessage(msg.channel, `${user.username} is naked.`);
      } else {
        bot.sendMessage(msg.channel, `${user.username}'s' avatar:\n${user.avatarURL}`);
      }
    }, bot.users.getAll('name', suffix));
  }
}

function channelinfo(bot, msg, suffix) {
  if (!msg.channel.server) {
    if (!suffix) {
      const channelinfo = (`\`\`\`Name: ${bot.user.name}
ID: ${msg.channel.id}
Type: Direct Message
New Messages: ${msg.channel.messages.length} (since the bot was restarted)
\`\`\``);
      bot.sendMessage(msg.channel, channelinfo);
    } else if (msg.content.indexOf('<#') !== -1) {
      R.forEach(suffix => {
        R.forEach(channel => {
          const channelinfo = (`\`\`\`Server: ${channel.server}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
New Messages: ${channel.messages.length} (since the bot was restarted)
Topic: ${channel.topic}
\`\`\``);
          bot.sendMessage(msg.channel, channelinfo);
        }, bot.channels.getAll('id', suffix.substring(2, suffix.length - 1)));
      }, suffix.split(' '));
    } else {
      R.forEach(channel => {
        const channelinfo = (`\`\`\`Server: ${channel.server}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
New Messages: ${channel.messages.length} (since the bot was restarted)
Topic: ${channel.topic}
\`\`\``);
        bot.sendMessage(msg.channel, channelinfo);
      }, bot.channels.getAll('name', suffix));
    }
  } else if (!suffix) {
    const channelinfo = (`\`\`\`Server: ${msg.channel.server}
Name: ${msg.channel.name}
ID: ${msg.channel.id}
Type: ${msg.channel.type}
Position: ${msg.channel.position}
New Messages: ${msg.channel.messages.length} (since the bot was restarted)
Topic: ${msg.channel.topic}
\`\`\``);
    bot.sendMessage(msg.channel, channelinfo);
  } else if (msg.content.indexOf('<#') !== -1) {
    R.forEach(suffix => {
      R.forEach(channel => {
        const channelinfo = (`\`\`\`Server: ${channel.server}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
New Messages: ${channel.messages.length} (since the bot was restarted)
Topic: ${channel.topic}
\`\`\``);
        bot.sendMessage(msg.channel, channelinfo);
      }, bot.channels.getAll('id', suffix.substring(2, suffix.length - 1)));
    }, suffix.split(' '));
  } else {
    R.forEach(channel => {
      const channelinfo = (`\`\`\`Server: ${channel.server}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
New Messages: ${channel.messages.length ? channel.messages.length : undefined} (since the bot was restarted)
Topic: ${channel.topic}
\`\`\``);
      bot.sendMessage(msg.channel, channelinfo);
    }, bot.servers.get('id', msg.channel.server.id).channels.getAll('name', suffix));
  }
}

function ping(bot, msg) {
  let time = process.hrtime();
  setTimeout(() => {
    let diff = process.hrtime(time);
    bot.sendMessage(msg.channel, `Pong!\n${diff[0]}s ${diff[1] / 1000000}ms`);
  }, 1);
}

function serverinfo(bot, msg, suffix) {
  if (suffix) {
    R.forEach(server => {
      const roles = R.join(', ', R.remove(0, 1, R.pluck('name', server.roles)));
      const serverinfo = (`\`\`\`Name: ${server.name}
ID: ${server.id}
Region: ${server.region}
Owner: ${server.owner.username}
Channels: ${server.channels.length}
Default Channel: ${server.defaultChannel.name}
AFK Channel: ${server.afkChannel ? server.afkChannel.name : null}
Members: ${server.members.length}
Roles: ${roles}
Icon: ${server.iconURL}
  \`\`\``);
      bot.sendMessage(msg.channel, serverinfo);
    }, bot.servers.getAll('name', suffix));
  } else if (!msg.channel.server) {
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
  } else if (!suffix) {
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
  if (!msg.channel.server) {
    if (!suffix) {
      const userinfo = (`\`\`\`Name: ${msg.author.username}
ID: ${msg.author.id}
Discriminator: ${msg.author.discriminator}
Status: ${msg.author.status}
Avatar: ${msg.author.avatarURL}
\`\`\``);
      bot.sendMessage(msg.channel, userinfo);
    } else {
      R.forEach(user => {
        const userinfo = (`\`\`\`Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status}
Avatar: ${user.avatarURL}
\`\`\``);
        bot.sendMessage(msg.channel, userinfo);
      }, bot.users.getAll('name', suffix));
    }
  } else if (!suffix && !msg.mentions.length) {
    const userinfo = (`\`\`\`Name: ${msg.author.username}
ID: ${msg.author.id}
Discriminator: ${msg.author.discriminator}
Status: ${msg.author.status}
Joined ${msg.channel.server.name}: ${new Date(msg.channel.server.detailsOfUser(msg.author).joinedAt).toUTCString()}
Avatar: ${msg.author.avatarURL}
\`\`\``);
    bot.sendMessage(msg.channel, userinfo);
  } else if (msg.mentions.length) {
    R.forEach(user => {
      const userinfo = (`\`\`\`Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status}
Joined ${msg.channel.server.name}: ${new Date(msg.channel.server.detailsOfUser(user).joinedAt).toUTCString()}
Avatar: ${user.avatarURL}
\`\`\``);
      bot.sendMessage(msg.channel, userinfo);
    }, msg.mentions);
  } else {
    R.forEach(user => {
      const userinfo = (`\`\`\`Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status}
Joined ${msg.channel.server.name}: ${new Date(msg.channel.server.detailsOfUser(user).joinedAt).toUTCString()}
Avatar: ${user.avatarURL}
\`\`\``);
      bot.sendMessage(msg.channel, userinfo);
    }, bot.servers.get('id', msg.channel.server.id).members.getAll('name', suffix));
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
      sentry(err, 'info', 'version');
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
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
  serverlist,
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
  serverlist: {category: 'info'},
  servers: {category: 'info'},
  userinfo: {parameters: ['username'], category: 'info'},
  uptime: {category: 'info'},
  version: {category: 'info'}
};
