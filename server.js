import { Client as Discord, PMChannel } from 'discord.js';
import chalk from 'chalk';
import nconf from 'nconf';
import R from 'ramda';

import './lib/config/init';
import './lib/config/express';
import './lib/config/sentry';
import './lib/config/phantom';
import commands from './lib';
import { callCmd } from './lib/helpers';

// Verify both username and password are set before launching the bot.
if (!nconf.get('EMAIL') || !nconf.get('PASSWORD')) {
  console.error('Please make sure both EMAIL and PASSWORD are set in env or config.js before starting Gravebot');
  process.exit(1);
}

// Init
const bot = new Discord();

// Listen for events on Discord
bot.on('ready', () => console.log(chalk.green(`Started successfully. Serving in ${bot.servers.length} servers`)));
bot.on('disconnected', () => {
  console.log(chalk.yellow(`[${Date().toString()}] Disconnected. Attempting to reconnect...`));
  setTimeout(() => {
    bot.login(nconf.get('EMAIL'), nconf.get('PASSWORD'));
  }, 5000);
});

function onMessage(msg) {
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
    let suffix = R.join(' ', R.slice(2, msg_split.length, msg_split));
    let cmd_name = msg_split[1].toLowerCase();
    let cmd = commands[cmd_name];

    if (cmd) callCmd(cmd, cmd_name, bot, msg, suffix);
    return;
  }

  // Check personal messages
  if (msg.channel instanceof PMChannel) {
    // Accept invite links directly though PMs
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
