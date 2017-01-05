import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';


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

  if (evt.message.channel.isPrivate) return Promise.resolve(`Sorry, we can\'t get ${suffix} avatar from a direct message. Try in a channel instead!`);
  const user = R.find(R.propEq('username', suffix))(evt.message.guild.members);
  if (!user) return;
  if (!user.avatarURL) return Promise.resolve(`${user.username} is naked.`);
  return Promise.resolve(`${user.username}'s avatar:\n${user.avatarURL}`);
}

function channelinfo(client, evt, suffix) {
  const channelinfo = [];
  if (evt.message.channel.isPrivate) {
    channelinfo.push(`\`\`\`ruby
ID: ${evt.message.channel.id}
Type: Direct Message
New_Messages: ${evt.message.channel.messages.length} (since the bot was restarted)
Created: ${new Date(evt.message.channel.createdAt).toGMTString()}
\`\`\``);
  } else if (!suffix && evt.message.content.indexOf('<#') === -1) {
    channelinfo.push(`\`\`\`ruby
Server: ${evt.message.guild.name}
Name: ${evt.message.channel.name}
ID: ${evt.message.channel.id}
Type: ${evt.message.channel.type}
Position: ${evt.message.channel.position}
New_Messages: ${evt.message.channel.messages.length} (since the bot was restarted)
Created: ${new Date(evt.message.channel.createdAt).toGMTString()}
Topic: ${evt.message.channel.topic}
\`\`\``);
  } else if (evt.message.content.indexOf('<#') !== -1) {
    R.forEach(suffix => {
      const channel = R.find(R.propEq('id', suffix.substring(2, suffix.length - 1)))(evt.message.guild.channels);
      if (channel.type === 0) {
        channelinfo.push(`\`\`\`ruby
Server: ${channel.guild.name}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
New_Messages: ${channel.messages.length} (since the bot was restarted)
Created: ${new Date(channel.createdAt).toGMTString()}
Topic: ${channel.topic}
\`\`\``);
      } else {
        channelinfo.push(`\`\`\`ruby
Server: ${channel.guild.name}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
Created: ${new Date(channel.createdAt).toGMTString()}
Bitrate: ${channel.bitrate}
User_Limit: ${channel.user_limit}
\`\`\``);
      }
    }, suffix.split(' '));
  } else {
    const channel = R.find(R.propEq('name', suffix))(evt.message.guild.channels);
    if (!channel) return;
    if (channel.type === 0) {
      channelinfo.push(`\`\`\`ruby
Server: ${channel.guild.name}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
New_Messages: ${channel.messages.length} (since the bot was restarted)
Created: ${new Date(channel.createdAt).toGMTString()}
Topic: ${channel.topic}
\`\`\``);
    } else {
      channelinfo.push(`\`\`\`ruby
Server: ${channel.guild.name}
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Position: ${channel.position}
Created: ${new Date(channel.createdAt).toGMTString()}
Bitrate: ${channel.bitrate}
User_Limit: ${channel.user_limit}
\`\`\``);
    }
  }

  return Promise.resolve(channelinfo);
}

function serverinfo(client, evt, suffix) {
  const serverinfo = [];
  if (evt.message.channel.isPrivate) return Promise.resolve('Use this in an actual server.\nhttp://fat.gfycat.com/GranularWeeCorydorascatfish.gif');
  if (!suffix) {
    const roles = R.join(', ', R.reject(name => name === '@everyone', R.pluck('name', evt.message.guild.roles)));
    serverinfo.push(`\`\`\`ruby
Name: ${evt.message.guild.name}
ID: ${evt.message.guild.id}
Region: ${evt.message.guild.region}
Owner: ${evt.message.guild.owner.username}
Channels: ${evt.message.guild.channels.length} (${evt.message.guild.textChannels.length} text & ${evt.message.guild.voiceChannels.length} voice)
Default_Channel: ${evt.message.guild.generalChannel.name}
AFK_Channel: ${evt.message.guild.afk_channel ? evt.message.guild.afk_channel.name : 'None'}
AFK_Timeout: ${evt.message.guild.afk_timeout / 60} minutes
Members: ${evt.message.guild.members.length}
Created: ${new Date(evt.message.guild.createdAt).toGMTString()}
Emojis: ${evt.message.guild.emojis.length ? R.join(', ', R.pluck('name', evt.message.guild.emojis)) : 'None'}
Roles: ${roles.length ? roles : 'None'}
Icon: ${evt.message.guild.iconURL ? `\`\`\`${evt.message.guild.iconURL}` : `None
\`\`\``}`);
  } else {
    const guild = R.find(R.propEq('name', suffix))(client.Guilds);
    if (!guild || nconf.get('SHARDING')) return;
    const roles = R.join(', ', R.reject(name => name === '@everyone', R.pluck('name', guild.roles)));
    serverinfo.push(`\`\`\`ruby
Name: ${guild.name}
ID: ${guild.id}
Region: ${guild.region}
Owner: ${guild.owner.username}
Channels: ${guild.channels.length} (${guild.textChannels.length} text & ${guild.voiceChannels.length} voice)
Default_Channel: ${guild.generalChannel.name}
AFK_Channel: ${guild.afk_channel.name ? guild.afk_channel.name : 'None'}
AFK_Timeout: ${guild.afk_timeout / 60} minutes
Members: ${guild.members.length}
Created: ${new Date(guild.createdAt).toGMTString()}
Emotes: ${guild.emojis.length ? R.join(', ', R.pluck('name', guild.emojis)) : 'None'}
Roles: ${roles}
Icon: ${guild.iconURL ? `\`\`\`${guild.iconURL}` : `None
\`\`\``}`);
  }

  return Promise.resolve(serverinfo);
}

function userinfo(client, evt, suffix) {
  const userinfo = [];
  if (evt.message.channel.isPrivate) {
    userinfo.push(`\`\`\`ruby
Name: ${evt.message.author.username}
ID: ${evt.message.author.id}
Discriminator: ${evt.message.author.discriminator}
Status: ${evt.message.author.status} ${evt.message.author.gameName ? '(Playing ' + evt.message.author.gameName + ')' : ''}
Registered: ${new Date(evt.message.author.registeredAt).toGMTString()}
Avatar: ${evt.message.author.avatarURL ? `\`\`\`${evt.message.author.avatarURL}` : `None
\`\`\``}`);
  } else if (!suffix && !evt.message.mentions.length) {
    userinfo.push(`\`\`\`ruby
Name: ${evt.message.author.username}
ID: ${evt.message.author.id}
Discriminator: ${evt.message.author.discriminator}
Status: ${evt.message.author.status} ${evt.message.author.gameName ? '(Playing ' + evt.message.author.gameName + ')' : ''}
Registered: ${new Date(evt.message.author.registeredAt).toGMTString()}
Avatar: ${evt.message.author.avatarURL ? `\`\`\`${evt.message.author.avatarURL}` : `None
\`\`\``}`);
  } else if (evt.message.mentions.length) {
    R.forEach(user => {
      userinfo.push(`\`\`\`ruby
Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status} ${user.gameName ? '(Playing ' + user.gameName + ')' : ''}
Registered: ${new Date(user.registeredAt).toGMTString()}
Avatar: ${user.avatarURL ? `\`\`\`${user.avatarURL}` : `None
\`\`\``}`);
    }, evt.message.mentions);
  } else {
    const user = R.find(R.propEq('username', suffix))(evt.message.guild.members);
    if (!user) return;
    userinfo.push(`\`\`\`ruby
Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status} ${user.gameName ? '(Playing ' + user.gameName + ')' : ''}
Registered: ${new Date(user.registeredAt).toGMTString()}
Avatar: ${user.avatarURL ? `\`\`\`${user.avatarURL}` : `None
\`\`\``}`);
  }

  return Promise.resolve(userinfo);
}

export default {
  avatar,
  channelinfo,
  serverinfo,
  userinfo,
  whois: userinfo
};

export const help = {
  avatar: {parameters: 'username'},
  channelinfo: {parameters: 'channelname'},
  serverinfo: {parameters: 'servername'},
  userinfo: {parameters: 'username'}
};
