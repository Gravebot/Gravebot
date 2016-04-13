// import Promise from 'bluebird';
import Discordie from 'discordie';
import chalk from 'chalk';
import moment from 'moment';
import nconf from 'nconf';
import R from 'ramda';

import './init-config';
import './express';
import './sentry';
import './phantom';
import commands from './commands';

import { getUserLang } from './redis';


// Init
var client = new Discordie();

// Checks for PMs older than 2 hours and deletes them..
/* function clearOldMessages() {
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cleaning old messages`));
  let count = 0;

  const getLastMessage = R.curry(Promise.promisify(bot.getChannelLogs).bind(bot))(R.__, 1, {});
  Promise.resolve(bot.privateChannels)
    .map(channel => {
      return getLastMessage(channel)
        .then(R.head)
        .then(R.prop('timestamp'))
        .then(timestamp => {
          // Remove cache from RAM
          R.forEach(message => {
            channel.messages.remove(message);
          }, channel.messages);

          const message_time = moment.unix(timestamp / 1000);
          if (message_time.isBefore(moment().subtract(2, 'hours'))) {
            count++;
            return channel.delete();
          }
        })
        .catch(() => {
          // This sometimes get thrown by channel.delete even though the channel does get deleted.
          // It can be ignored
        });
    }, {concurrency: 5})
    .then(() => {
      console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Removed ${count} private channels`));
    })
    .catch(err => {
      console.log(chalk.red(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Error removing private channels`));
      console.log(chalk.red(err));
    });
}

// Clear PMs once a day.
if (nconf.get('CLEAN_MESSAGES') === 'true') setInterval(() => clearOldMessages(), 86400000);
*/
// Listen for events on Discord
client.Dispatcher.on('GATEWAY_READY', e => {
  client.Users.fetchMembers();
  console.log(chalk.green(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Started successfully.`));
  // if (nconf.get('CLEAN_MESSAGES') === 'true' && nconf.get('CLEAN_ON_BOOT') !== 'false') setTimeout(() => clearOldMessages(), 5000);
});

function callCmd(cmd, name, client, e, suffix) {
  console.log(`${chalk.blue('[' + moment().format('HH:mm:ss' + ']'))} ${chalk.bold.green(name)}: ${suffix}`);
  getUserLang(e.message.author.id).then(lang => {
    cmd(client, e, suffix, lang);
  });
}

function onMessage(e) {
  if (client.User.id === e.message.author.id) return;

  // Checks for PREFIX
  if (e.message.content[0] === nconf.get('PREFIX')) {
    let command = e.message.content.toLowerCase().split(' ')[0].substring(1);
    let suffix = e.message.content.substring(command.length + 2);
    let cmd = commands[command];

    if (cmd) callCmd(cmd, command, client, e, suffix);
    return;
  }

  // Checks if bot was mentioned
  if (client.User.isMentioned(e.message)) {
    let msg_split = e.message.content.split(' ');

    // If bot was mentioned without a command, then skip.
    if (!msg_split[1]) return;

    let suffix = R.join(' ', R.slice(2, msg_split.length, msg_split));
    let cmd_name = msg_split[1].toLowerCase();
    if (cmd_name[0] === nconf.get('PREFIX')) cmd_name = cmd_name.slice(1);
    let cmd = commands[cmd_name];

    if (cmd) callCmd(cmd, cmd_name, client, e, suffix);
    return;
  }

  // Check personal messages
  if (e.message.channel.is_private) {
    // Accept invite links directly through PMs
    if (e.message.content.indexOf('https://discord.gg/') > -1 || e.message.content.indexOf('https://discordapp.com/invite/') > -1) {
      e.message.channel.sendMessage('To invite Gravebot to your server, click the link below and select a server.\nOnly users with **Manage Server** permission in that server are able to invite the bot to it.');
    }

    let msg_split = e.message.content.split(' ');
    let suffix = R.join(' ', R.slice(1, msg_split.length, msg_split));
    let cmd_name = msg_split[0].toLowerCase();
    let cmd = commands[cmd_name];

    if (cmd) callCmd(cmd, cmd_name, client, e, suffix);
    return;
  }
}

client.Dispatcher.on('MESSAGE_CREATE', onMessage);
client.Dispatcher.on('MESSAGE_UPDATE', onMessage);

function connect() {
  if (nconf.get('TOKEN')) {
    client.connect({
      token: nconf.get('TOKEN')
    });
  } else if (nconf.get('EMAIL') && nconf.get('PASSWORD')) {
    let auth = {
      email: nconf.get('EMAIL'),
      password: nconf.get('PASSWORD')
    };
    client.connect(auth);
  } else {
    console.error('Please setup TOKEN or EMAIL and PASSWORD in config.js to use Gravebot');
    process.exit(1);
  }
}

connect();

client.Dispatcher.on('DISCONNECTED', e => {
  console.log(chalk.yellow(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Disconnected. Attempting to reconnect...`));
  setTimeout(() => {
    connect();
  }, 5000);
});
