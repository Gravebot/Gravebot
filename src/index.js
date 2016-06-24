import Promise from 'bluebird';
import Discordie from 'discordie';
import chalk from 'chalk';
import moment from 'moment';
import nconf from 'nconf';
import R from 'ramda';

import './init-config';
import './express';
import './phantom';

import commands from './commands';
import sentry from './sentry';

import { getMessageTTL, setMessageTTL, getUserLang } from './redis';

const request = Promise.promisify(require('request'));


// Init
const client = new Discordie();
let initialized = false;


function callCmd(cmd, name, client, evt, suffix) {
  console.log(`${chalk.blue('[' + moment().format('HH:mm:ss' + ']'))} ${chalk.bold.green(name)}: ${suffix}`);

  function processEntry(entry) {
    // If string or number, send as a message
    if (R.is(String, entry) || R.is(Number, entry)) evt.message.channel.sendMessage(entry);
    // If buffer, send as a file, with a default name
    if (Buffer.isBuffer(entry)) evt.message.channel.uploadFile(entry, 'file.png');
    // If it's an object that contains key 'upload', send file with an optional file name
    // This works for both uploading local files and buffers
    if (R.is(Object, entry) && entry.upload) evt.message.channel.uploadFile(entry.upload, entry.filename);
  }

  const user_id = evt.message.author.id;
  getMessageTTL(user_id).then(exists => {
    // If a user is trying to spam messages above the set TTL time, then skip.
    if (exists) return;
    setMessageTTL(user_id);

    return getUserLang(user_id).then(lang => {
      const cmd_return = cmd(client, evt, suffix, lang);

      // All command returns must be a bluebird promise.
      if (cmd_return instanceof Promise) {
        return cmd_return.then(res => {
          // If null, don't do anything.
          if (!res) return;
          // If it's an array, process each entry.
          if (R.is(Array, res)) return R.forEach(processEntry, res);
          // Process single entry
          processEntry(res);
        })
        .catch(err => {
          sentry(err, name);
          evt.message.channel.sendMessage(`Error: ${err.message}`);
        });
      }
    });
  });
}

function onMessage(evt) {
  if (!evt.message) return;
  if (client.User.id === evt.message.author.id) return;

  // Checks for PREFIX
  if (evt.message.content[0] === nconf.get('PREFIX')) {
    const command = evt.message.content.toLowerCase().split(' ')[0].substring(1);
    const suffix = evt.message.content.substring(command.length + 2);
    const cmd = commands[command];

    if (cmd) callCmd(cmd, command, client, evt, suffix);
    return;
  }

  // Checks if bot was mentioned
  if (client.User.isMentioned(evt.message)) {
    const msg_split = evt.message.content.split(' ');

    // If bot was mentioned without a command, then skip.
    if (!msg_split[1]) return;

    const suffix = R.join(' ', R.slice(2, msg_split.length, msg_split));
    let cmd_name = msg_split[1].toLowerCase();
    if (cmd_name[0] === nconf.get('PREFIX')) cmd_name = cmd_name.slice(1);
    const cmd = commands[cmd_name];

    if (cmd) callCmd(cmd, cmd_name, client, evt, suffix);
    return;
  }

  // Check personal messages
  if (evt.message.channel.is_private) {
    // Handle invite links
    if (evt.message.content.indexOf('https://discord.gg/') > -1 || evt.message.content.indexOf('https://discordapp.com/invite/') > -1) {
      return commands.join(client, evt, evt.message.content);
    }

    const msg_split = evt.message.content.split(' ');
    const suffix = R.join(' ', R.slice(1, msg_split.length, msg_split));
    const cmd_name = msg_split[0].toLowerCase();
    const cmd = commands[cmd_name];

    if (cmd) callCmd(cmd, cmd_name, client, evt, suffix);
    return;
  }
}

function carbon() {
  if (nconf.get('CARBON_KEY')) {
    request({
      url: 'https://www.carbonitex.net/discord/data/botdata.php',
      headers: {'content-type': 'application/json'},
      json: {
        key: nconf.get('CARBON_KEY'),
        servercount: client.Guilds.length
      }
    }).catch(console.log);
  }
}
setInterval(() => carbon(), 3600000);

function connect() {
  if (!nconf.get('TOKEN') || !nconf.get('CLIENT_ID')) {
    console.error('Please setup TOKEN and CLIENT_ID in config.js to use Gravebot');
    process.exit(1);
  }

  client.connect({token: nconf.get('TOKEN')});
}

function forceFetchUsers() {
  console.log(chalk.green(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Force fetching users.`));
  client.Users.fetchMembers();
}

// Listen for events on Discord
client.Dispatcher.on('GATEWAY_READY', () => {
  console.log(chalk.green(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Started successfully. Connected to ${client.Guilds.length} servers.`));
  setTimeout(() => forceFetchUsers(), 45000);

  if (!initialized) {
    initialized = true;
    setTimeout(() => carbon(), 20000);

    client.Dispatcher.on('MESSAGE_CREATE', onMessage);
    client.Dispatcher.on('MESSAGE_UPDATE', onMessage);
  }
});

client.Dispatcher.on('DISCONNECTED', () => {
  console.log(chalk.yellow(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Disconnected. Attempting to reconnect...`));
  setTimeout(() => {
    connect();
  }, 2000);
});

connect();
