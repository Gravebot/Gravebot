import { spawn } from 'child_process';
import R from 'ramda';
import path from 'path';

const root_dir = path.join(__dirname, '../../');
const total_shards = 4;

R.forEach(num => {
  num -= 1;
  const instance = spawn('npm', ['run', 'dev-nodebug'], {
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
  });
}, R.range(1, total_shards + 1));
