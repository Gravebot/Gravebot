import chai from 'chai';

import info from '../../src/commands/info/servers';


chai.should();

describe('servers', () => {
  it('should return a string containing statistics information', () => {
    const client = {Guilds: ['test'], Channels: ['channel'], Users: ['user']};
    return info.servers(client, {})
    .then(res => res.should.equal('Connected to 1 servers, 1 channels and 1 users.'));
  });
});
