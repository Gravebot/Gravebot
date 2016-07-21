import Promise from 'bluebird';


function ping() {
  const start = process.hrtime();
  return Promise.resolve('Pong!').then(() => {
    const diff = process.hrtime(start);
    return `Pong!\n${(diff[0] * 1000) + (diff[1] / 1000000)}s`;
  });
}

export default {
  ping
};

export const help = {
  ping: {}
};
