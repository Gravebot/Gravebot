const spawn = require('child_process').spawn;
const R = require('ramda');
const path = require('path');

const root_dir = path.join(__dirname, '../../');
const total_shards = process.env.SHARD_COUNT ? Number(process.env.SHARD_COUNT) : 10;

function startInstance(num) {
  const instance = spawn('node', ['index.js'], {
    cwd: root_dir,
    env: R.merge(process.env, {
      SHARDING: true,
      SHARD_COUNT: total_shards,
      SHARD_NUMBER: num,
      PORT: 5000 + num
    })
  });

  instance.stdout.on('data', (data) => {
    process.stdout.write(`[${num}] ${data}`);
  });

  instance.stderr.on('data', (data) => {
    process.stderr.write(`[${num}] ${data}`);
  });

  instance.on('close', (code) => {
    console.log(`Instance number ${code} process exited with code ${code}`);
    if (code !== 0) {
      startInstance(num);
    }
  });
}

R.forEach(num => {
  setTimeout(() => {
    startInstance(num);
  }, 30000 * num);
}, R.range(0, total_shards));
