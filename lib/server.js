import R from 'ramda';

export default {
  join: (bot, msg, suffix) => {
    if (!suffix) {
      bot.sendMessage(msg.channel, 'Usage: **`!join`** `invitation link`');
      return;
    }
    let invite = msg.content.split(' ')[1];
    bot.joinServer(invite, (err, server) => {
      if (err) {
        bot.sendMessage(msg.channel, `Failed to join: ${err}`);
      } else {
        bot.sendMessage(msg.channel, `Successfully joined ${server}`);
      }
    });
  },
  'join-server': (bot, msg, suffix) => {
    if (!suffix) {
      bot.sendMessage(msg.channel, 'Usage: **`!join-server`** `invitation link`');
      return;
    }
    let invite = msg.content.split(' ')[1];
    bot.joinServer(invite, (err, server) => {
      if (err) {
        bot.sendMessage(msg.channel, `Failed to join: ${err}`);
      } else {
        bot.sendMessage(msg.channel, `Successfully joined ${server}`);
      }
    });
  },
  serverinfo: (bot, msg) => {
    if (msg.channel.server) {
      let serverinfo = (`\`\`\`
  Server Name: ${msg.channel.server.name}
  Server ID: ${msg.channel.server.id}
  Server Region: ${msg.channel.server.region}
  Server Owner: ${msg.channel.server.owner.username}
  Channels: ${msg.channel.server.channels.length}
  Default Channel: ${msg.channel.server.defaultChannel.name}
  Members: ${msg.channel.server.members.length}
  Server Icon: ${msg.channel.server.iconURL}
        \`\`\``);
      bot.sendMessage(msg.channel, serverinfo);
    } else {
      bot.sendMessage(msg.channel, `Use it in a server. *duh* :cow2:`);
    }
  },
  serverlist: (bot, msg) => {
    let server_list = R.map(server => {
      let online = server.members.reduce((count, member) => count + (member.status === 'online' ? 1 : 0), 0);
      return `**\`${server}\`** ${server.members.length} members (${online} online)`;
    });
    bot.sendMessage(msg.channel, server_list.join('\n'));
  },
  servers: (bot, msg) => {
    bot.sendMessage(msg.channel, `Connected to ${bot.servers.length} servers, ${bot.channels.length} channels and ${bot.users.length} users.`);
  },
  userinfo: (bot, msg, suffix) => {
    if (msg.mentions.length === 0) {
      var userinfo = (`\`\`\`
Name: ${msg.author.username}
ID: ${msg.author.id}
Discriminator: ${msg.author.discriminator}
Status: ${msg.author.status}
Avatar: ${msg.author.avatarURL}
        \`\`\``);
      bot.sendMessage(msg.channel, userinfo);
    } else {
      R.forEach(user => {
        if (user != null) {
          var userinfo = (`\`\`\`
Name: ${user.username}
ID: ${user.id}
Discriminator: ${user.discriminator}
Status: ${user.status}
Avatar: ${user.avatarURL}
            \`\`\``);
          bot.sendMessage(msg.channel, userinfo);
        }
      }, msg.mentions);
    }
  },
  uptime: (bot, msg) => {
    let uptimeh = Math.floor((bot.uptime / 1000) / (60 * 60));
    let uptimem = Math.floor((bot.uptime / 1000) % (60 * 60) / 60);
    let uptimes = Math.floor((bot.uptime / 1000) % 60);
    bot.sendMessage(msg.channel, `I have been alive for:
${uptimeh} Hours
${uptimem} Minutes
${uptimes} Seconds
    `);
  }
};
