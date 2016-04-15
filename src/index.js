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
const client = new Discordie();


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
    // Handle invite links
    if (e.message.content.indexOf('https://discord.gg/') > -1 || e.message.content.indexOf('https://discordapp.com/invite/') > -1) {
      return commands.join(client, e, e.message.content);
    }

    let msg_split = e.message.content.split(' ');
    let suffix = R.join(' ', R.slice(1, msg_split.length, msg_split));
    let cmd_name = msg_split[0].toLowerCase();
    let cmd = commands[cmd_name];

    if (cmd) callCmd(cmd, cmd_name, client, e, suffix);
    return;
  }
}

function connect() {
  if (!nconf.get('TOKEN')) {
    console.error('Please setup TOKEN or EMAIL and PASSWORD in config.js to use Gravebot');
    process.exit(1);
  }

  client.connect({token: nconf.get('TOKEN')});
}

// Listen for events on Discord
client.Dispatcher.on('GATEWAY_READY', e => {
  client.Users.fetchMembers();
  console.log(chalk.green(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Started successfully. Connected to ${client.Guilds.length} servers.`));
});


client.Dispatcher.on('DISCONNECTED', e => {
  console.log(chalk.yellow(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Disconnected. Attempting to reconnect...`));
  setTimeout(() => {
    connect();
  }, 2000);
});


client.Dispatcher.on('MESSAGE_CREATE', onMessage);
client.Dispatcher.on('MESSAGE_UPDATE', onMessage);

connect();
