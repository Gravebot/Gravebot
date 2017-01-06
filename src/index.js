import { cpus } from 'os';
import nconf from 'nconf';
import R from 'ramda';
import './init-config';

import { start } from './discord';
import { subscriber, publisher, ee, waitForConnections } from './redis';
import sentry from './sentry';
import logger from './logger';


// With sharding enabled, each instance on a machine will boot (CPU-COUNT - 1) concurrently,
// leaving 1 CPU available for other system process'. When a shard has booted, it'll emit to a redis pub/sub
// to notify the other shards it's finished and to begin booting the next in line.
// Before booting, a redis message is emited to see if another instance is alive meaning a cluster has already been started,
// and then skips the queuing process and boots.

let skip_queue_timeout;
let booting = false;
if (nconf.get('SHARDING')) {
  const cpu_count = cpus().length;
  const concurrency = cpu_count === 1 ? 1 : cpu_count - 1; // Leave 1 CPU available for other system processing.
  const shard_number = Number(nconf.get('SHARD_NUMBER'));

  waitForConnections()
    .then(() => publisher.pubsubAsync('NUMSUB', 'active_shard'))
    .then(R.nth(1))
    .then(active_shards => {
      if (!active_shards && shard_number > (concurrency - 1)) {
        logger.info('Queueing up to boot');
        ee.on('shard_done', shard_id => {
          // TODO: Shards wait for others to boot even if on other systems.
          // This needs to also include a system check to continue starting.
          shard_id = (Number(shard_id) + 1);
          if (shard_id === shard_number && !booting) {
            booting = true;
            if (skip_queue_timeout) clearTimeout(skip_queue_timeout);
            start();
          }

          // If other shards are having some issues booting, skip queue and continue.
          if ((shard_id + 1) === shard_number && !booting) {
            logger.info('Setting skipped queue timeout');
            skip_queue_timeout = setTimeout(() => {
              logger.info('Previous shard is taking too long to boot. Start booting.');
              booting = true;
              start();
            }, 120000);
          }
        });
        subscriber.subscribe('shard_done');
      } else {
        start();
      }
    })
    .catch(err => sentry(err));
} else {
  start();
}
