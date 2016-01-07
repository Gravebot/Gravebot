import { Client as Discord, PMChannel } from 'discord.js';
import express from 'express';
import nconf from 'nconf';
import R from 'ramda';

import './lib/config/init';
import commands from './lib';
import { callCmd } from './lib/helpers';

// Verify both username and password are set before launching the bot.
if (!nconf.get('EMAIL') || !nconf.get('PASSWORD')) {
  console.error('Please make sure both EMAIL and PASSWORD are set in env or config.js before starting Gravebot');
  process.exit(1);
}

// Init
const bot = new Discord();

// Start health check endpoint
const web = express();
web.use('/', (req, res) => {
  res.json({status: 'okay'});
});
web.listen(process.env.PORT || 5000);

// Listen for events
bot.on('ready', () => console.log(`Started successfully. Serving in ${bot.servers.length} servers`));
bot.on('disconnected', () => {
  console.log(`[${Date().toString()}] Disconnected. Attempting to reconnect...`);
  setTimeout(() => {
    bot.login(nconf.get('EMAIL'), nconf.get('PASSWORD'));
  }, 5000);
});

bot.on('message', msg => {
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
    let cmd = commands[msg_split[1]];

    if (cmd) callCmd(cmd, msg_split[1], bot, msg, suffix);
    return;
  }

  // Check personal messages
  if (msg.channel instanceof PMChannel) {
    let msg_split = msg.content.split(' ');
    let suffix = R.join(' ', R.slice(1, msg_split.length, msg_split));
    let cmd = commands[msg_split[0]];

    if (cmd) callCmd(cmd, msg_split[0], bot, msg, suffix);
    return;
  }
});

bot.login(nconf.get('EMAIL'), nconf.get('PASSWORD'));
