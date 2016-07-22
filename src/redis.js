import Promise from 'bluebird';
import { EventEmitter } from 'events';
import nconf from 'nconf';
import redis from 'redis';

import logger from './logger';
import sentry from './sentry';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client_url = nconf.get('REDIS_URL') || nconf.get('REDISCLOUD_URL') || 'redis://127.0.0.1:6379';
const client = redis.createClient({url: client_url});
export default client;


function createLoggers(redisClient, type) {
  redisClient.on('connect', () => logger.info(`Redis ${type} connected`));
  redisClient.on('reconnecting', () => logger.warn(`Redis ${type} reconnecting`));
  redisClient.on('ready', () => logger.info(`Redis ${type} ready`));
  redisClient.on('error', err => sentry(err, 'redis'));
}

createLoggers(client, 'default');


export function createDuplicateClient(name) {
  const pubsubClient = client.duplicate();
  createLoggers(pubsubClient, name);
  return pubsubClient;
}

// Sharding
let pubClient, subClient, shardEmitter;
if (nconf.get('SHARDING')) {
  pubClient = createDuplicateClient('cmd emitter pub');
  subClient = createDuplicateClient('cmd emitter sub');
  shardEmitter = new EventEmitter();

  subClient.on('message', (channel, message) => {
    shardEmitter.emit(channel, JSON.parse(message));
  });
}

// Gets a users language based on ID
export function getUserLang(user_id) {
  return client.hgetAsync(`user_${user_id}`, 'lang')
    .then(lang => lang || 'en')
    .timeout(2000)
    .catch(err => {
      sentry(err, 'getUserLang');
      return 'en';
    });
}

// Sets a users language based on ID
export function setUserLang(user_id, lang) {
  return client.hsetAsync(`user_${user_id}`, 'lang', lang)
    .timeout(2000)
    .catch(err => {
      sentry(err, 'setUserLang');
    });
}

export function getMessageTTL(user_id) {
  return client.getAsync(`ttl_${user_id}`)
    .timeout(2000)
    .catch(err => {
      sentry(err, 'getMessageTTL');
      return false;
    });
}

export function setMessageTTL(user_id) {
  const key = `ttl_${user_id}`;
  return client.multi()
    .set(key, 1)
    .expire(key, nconf.get('MESSAGE_TTL') || 1)
    .execAsync()
    .timeout(2000)
    .catch(err => {
      sentry(err, 'setMessageTTL');
    });
}

export function getShardsCmdResults(cmd, suffix = '', lang = '') {
  return new Promise((resolve, reject) => {
    const channel_name = `${cmd}_${new Date().getTime()}`;
    const results = [];

    shardEmitter.on(channel_name, result => {
      results.push(result);
      if (results.length === (nconf.get('SHARD_COUNT') - 1)) {
        subClient.unsubscribe(channel_name);
        resolve(results);
      }
    });

    subClient.subscribe(channel_name);
    pubClient.publish('cmd', JSON.stringify({
      channel_name,
      instance: nconf.get('SHARD_NUMBER'),
      request: {cmd, suffix, lang}
    }));
  }).timeout(15000);
}
