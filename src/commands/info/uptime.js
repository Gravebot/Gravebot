import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';

import { getShardsCmdResults } from '../../redis';


function uptime(client, evt, suffix, lang, json) {
  const uptimeh = Math.floor(process.uptime() / (60 * 60));
  const uptimem = Math.floor(process.uptime() % (60 * 60) / 60);
  const uptimes = Math.floor(process.uptime() % 60);

  if (nconf.get('SHARDING') && !json) {
    return getShardsCmdResults('uptime')
      .then(R.append({shard: nconf.get('SHARD_NUMBER'), results: {uptimeh, uptimem, uptimes}}))
      .then(R.sortBy(R.prop('shard')))
      .map(({shard, results}) => {
        if (!results || R.isEmpty(results)) return `Shard ${shard} isn't live yet.`;
        return `Shard ${shard} has been alive for:
${results.uptimeh} Hours
${results.uptimem} Minutes
${results.uptimes} Seconds`;
      })
      .then(R.join('\n\n'));
  }

  if (json) return Promise.resolve({uptimeh, uptimem, uptimes});

  return Promise.resolve(`I have been alive for:
${uptimeh} Hours
${uptimem} Minutes
${uptimes} Seconds`);
}

export default {
  uptime
};

export const help = {
  uptime: {}
};
