import Promise from 'bluebird';
import { Client as Discord, PMChannel } from 'discord.js';
import chalk from 'chalk';
import moment from 'moment';
import nconf from 'nconf';
import R from 'ramda';

import './init-config';
import './express';
import './sentry';
import './phantom';
import commands from './commands';


// Verify both username and password are set before launching the bot.
if (!nconf.get('EMAIL') || !nconf.get('PASSWORD')) {
  console.error('Please make sure both EMAIL and PASSWORD are set in env or config.js before starting Gravebot');
  process.exit(1);
}

// Init
const bot = new Discord();

// Checks for PMs older than 2 days and deletes them.
function clearOldMessages() {
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
          if (message_time.isBefore(moment().subtract(2, 'days'))) {
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
setInterval(() => clearOldMessages(), 86400000);

// Listen for events on Discord
bot.on('ready', () => {
  console.log(chalk.green(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Started successfully. Serving in ${bot.servers.length} servers`));
  setTimeout(() => clearOldMessages(), 5000);
});

bot.on('disconnected', () => {
  console.log(chalk.yellow(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Disconnected. Attempting to reconnect...`));
  setTimeout(() => {
    bot.login(nconf.get('EMAIL'), nconf.get('PASSWORD'));
  }, 5000);
});

function callCmd(cmd, name, bot, msg, suffix) {
  console.log(`${chalk.blue('[' + moment().format('HH:mm:ss' + ']'))} ${chalk.bold.green(name)}: ${suffix}`);
  cmd(bot, msg, suffix);
}

function onMessage(msg) {
  if (bot.user.username === msg.author.username) return;

  // Checks for PREFIX
  if (msg.content[0] === nconf.get('PREFIX')) {
    let command = msg.content.toLowerCase().split(' ')[0].substring(1);
    let suffix = msg.content.substring(command.length + 2);
    let cmd = commands[command];

    if (cmd) callCmd(cmd, command, bot, msg, suffix);
    return;
  }

  // Checks if bot was mentioned
  if (msg.isMentioned(bot.user)) {
    let msg_split = msg.content.split(' ');

    // If bot was mentioned without a command, then skip.
    if (!msg_split[1]) return;

    let suffix = R.join(' ', R.slice(2, msg_split.length, msg_split));
    let cmd_name = msg_split[1].toLowerCase();
    if (cmd_name[0] === nconf.get('PREFIX')) cmd_name = cmd_name.slice(1);
    let cmd = commands[cmd_name];

    if (cmd) callCmd(cmd, cmd_name, bot, msg, suffix);
    return;
  }

  // Check personal messages
  if (msg.channel instanceof PMChannel) {
    // Accept invite links directly through PMs
    if (msg.content.indexOf('https://discord.gg/') > -1 || msg.content.indexOf('https://discordapp.com/invite/') > -1) {
      return commands.join(bot, msg, msg.content);
    }

    let msg_split = msg.content.split(' ');
    let suffix = R.join(' ', R.slice(1, msg_split.length, msg_split));
    let cmd_name = msg_split[0].toLowerCase();
    let cmd = commands[cmd_name];

    if (cmd) callCmd(cmd, cmd_name, bot, msg, suffix);
    return;
  }
}

bot.on('message', onMessage);
bot.on('messageUpdated', onMessage);

bot.login(nconf.get('EMAIL'), nconf.get('PASSWORD'));
