import Promise from 'bluebird';
import Discordie from 'discordie';
import nconf from 'nconf';
import R from 'ramda';

import commands from './commands';
import datadog from './datadog';
import logger from './logger';
import sentry from './sentry';
import startExpress from './express';
import { init as initPhantom } from './phantom';

import { startPortalTimeouts, startPortalIntervals } from './portals';
import {
  getMessageTTL,
  setMessageTTL,
  getUserLang,
  subscriber,
  publisher,
  ee
} from './redis';


// Init
let client;
let initialized = false;


function callCmd(cmd, name, client, evt, suffix) {
  logger.cmd(name, suffix);
  datadog(`cmd.${name}`, 1);

  function processEntry(entry) {
    // If string or number, send as a message
    if (R.is(String, entry) || R.is(Number, entry)) evt.message.channel.sendMessage(entry)
      .catch((err, res) => {
        err.res = res;
        sentry(err, 'discordie.sendMessage');
      });
    // If buffer, send as a file, with a default name
    if (Buffer.isBuffer(entry)) evt.message.channel.uploadFile(entry, 'file.png')
      .catch((err, res) => {
        err.res = res;
        sentry(err, 'discordie.uploadFile');
      });
    // If it's an object that contains key 'upload', send file with an optional file name
    // This works for both uploading local files and buffers
    if (R.is(Object, entry) && entry.upload) evt.message.channel.uploadFile(entry.upload, entry.filename)
      .catch((err, res) => {
        err.res = res;
        sentry(err, 'discordie.uploadFile');
      });
  }

  const user_id = evt.message.author.id;
  const start_time = new Date().getTime();
  getMessageTTL(user_id).then(exists => {
    // If a user is trying to spam messages above the set TTL time, then skip.
    if (exists) return;
    setMessageTTL(user_id);

    return getUserLang(user_id).then(lang => {
      const cmd_return = cmd(client, evt, suffix, lang);

      // All command returns must be a bluebird promise.
      if (cmd_return instanceof Promise) {
        return cmd_return.then(res => {
          const execution_time = new Date().getTime() - start_time;
          datadog(`cmd_execution_time.${name}`, execution_time);
          // If null, don't do anything.
          if (!res) return logger.warn(`Command ${name} didn't return anything. Suffix: ${suffix}`);
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
  })
  .catch(err => {
    sentry(err, name);
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
  if (evt.message.channel.isPrivate) {
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

function connect() {
  if (!nconf.get('TOKEN')) {
    logger.error('Please setup TOKEN in config.js to use Gravebot');
    process.exit(1);
  }

  client.connect({token: nconf.get('TOKEN')});
}

function forceFetchUsers() {
  logger.info('Force fetching users');
  client.Users.fetchMembers();
}

if (nconf.get('SHARDING')) {
  ee.on('cmd', message => {
    const { channel_name, instance, request: { cmd, suffix, lang } } = JSON.parse(message);
    if (instance === nconf.get('SHARD_NUMBER')) return;

    // If this shard isn't ready yet, return empty object.
    if (!client || !client.bot) return publisher.publish(channel_name, JSON.stringify({shard: nconf.get('SHARD_NUMBER'), results: {}}));

    commands[cmd](client, {}, suffix, lang, true)
      .then(results => {
        publisher.publish(channel_name, JSON.stringify({shard: nconf.get('SHARD_NUMBER'), results}));
      });
  });
  subscriber.subscribe('cmd');
}

// Start connects to discord and starts receiving messages. It also emits to a shard pub/sub to notifiy it's booted if
export function start() {
  const discordie_options = {};
  if (nconf.get('SHARDING')) {
    discordie_options.shardCount = Number(nconf.get('SHARD_COUNT'));
    discordie_options.shardId = Number(nconf.get('SHARD_NUMBER'));
    logger.info(`Starting shard ${discordie_options.shardId}`);
  }

  client = new Discordie(discordie_options);

  // Listen for events on Discord
  client.Dispatcher.on('GATEWAY_READY', () => {
    logger.info(`Started successfully. Connected to ${client.Guilds.length} servers.`);
    setTimeout(forceFetchUsers, 45000);

    if (!initialized) {
      initialized = true;
      startExpress();
      initPhantom();

      // Only the last shard does portal submissions on boot
      if (nconf.get('SHARDING')) {
        if ((discordie_options.shardId + 1) === discordie_options.shardCount) startPortalTimeouts(client);
      } else {
        startPortalTimeouts(client);
      }

      client.Dispatcher.on('MESSAGE_CREATE', onMessage);
      client.Dispatcher.on('MESSAGE_UPDATE', onMessage);
      if (nconf.get('SHARDING')) {
        subscriber.subscribe('active_shard');
        publisher.publish('shard_done', discordie_options.shardId);
      }
    }
  });

  client.Dispatcher.on('DISCONNECTED', err => {
    logger.warn({message: 'Disconnected. Attempting to reconnect in 20 seconds...', err});
    sentry(err, 'discord');
    setTimeout(connect, 20000);
  });

  startPortalIntervals(client);
  connect();
}
