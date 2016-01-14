import chai from 'chai';
import fs from 'fs';
import nock from 'nock';
import path from 'path';
import server from '../lib/server';

chai.should();
const res_fixture = fs.readFileSync(path.join(__dirname, './fixtures/version.md'));

describe('server', () => {
  describe('avatar', () => {
    it('should return a url to an avatar for self', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('Your avatar:\nhttp://test.dev/img.jpg');
        done();
      }

      let msg = {
        channel: 'test',
        mentions: [],
        author: {
          avatarURL: 'http://test.dev/img.jpg'
        }
      };

      server.avatar({sendMessage}, msg);
    });

    it('should return a url to an avatar for a mentioned user', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res[0].should.equal('test\'s avatar:\nhttp://test.dev/img.jpg');
        done();
      }

      let msg = {
        channel: 'test',
        mentions: [{
          avatarURL: 'http://test.dev/img.jpg',
          username: 'test'
        }]
      };

      server.avatar({sendMessage}, msg);
    });
  });

  describe('join/join-server', () => {
    it('should join execute joinServer and respond with with a success message', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('Successfully joined Test Server');
        done();
      }

      function joinServer(url, next) {
        return next(null, 'Test Server');
      }

      let invite_url = 'http://discord.gg/123456';
      server.join({sendMessage, joinServer}, {channel: 'test', content: invite_url}, invite_url);
    });
  });

  describe('serverinfo', () => {
    it('should return a string containing server information', done => {
      function sendMessage(channel, res) {
        channel.should.equal(channel);
        res.should.equal(`\`\`\`Server Name: test
Server ID: 1234
Server Region: london
Server Owner: user
Channels: 1
Default Channel: abc
Members: 1
Roles: role1, role2
Server Icon: http://website.com/img.png
\`\`\``);
        done();
      }

      let channel = {
        server: {
          name: 'test',
          id: '1234',
          region: 'london',
          owner: {
            username: 'user'
          },
          channels: ['abc'],
          defaultChannel: {
            name: 'abc'
          },
          roles: [{name: '@everyone'}, {name: 'role1'}, {name: 'role2'}],
          iconURL: 'http://website.com/img.png',
          members: ['user']
        }
      };

      server.serverinfo({sendMessage}, {channel});
    });
  });

  describe('serverlist', () => {
    it('should return a string containing server information', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('**`test`** 2 members (2 online)');
        done();
      }

      let servers = [{
        name: 'test',
        members: [{status: 'online'}, {status: 'online'}]
      }];

      server.serverlist({sendMessage, servers}, {channel: 'test'});
    });
  });

  describe('servers', () => {
    it('should return a string containing server information', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('Connected to 1 servers, 1 channels and 1 users.');
        done();
      }

      let bot = {
        sendMessage,
        servers: ['test'],
        channels: ['channel'],
        users: ['user']
      };

      server.servers(bot, {channel: 'test'});
    });
  });

  describe('userinfo', () => {
    it('should return user info for requesting user', done => {
      let msg = {
        mentions: [],
        channel: {
          server: {
            name: 'server',
            detailsOfUser: () => {
              return {joinedAt: 'Sun, 27 Sep 2015 19:32:46 GMT'};
            }
          }
        },
        author: {
          username: 'user',
          id: 1,
          discriminator: 1234,
          status: 'online',
          joined: 'Sun, 27 Sep 2015 19:32:46 GMT',
          avatarURL: 'http://website.com/img.png'
        }
      };

      function sendMessage(channel, res) {
        channel.should.equal(msg.channel);
        res.should.equal(`\`\`\`Name: user
ID: 1
Discriminator: 1234
Status: online
Joined server: Sun, 27 Sep 2015 19:32:46 GMT
Avatar: http://website.com/img.png
\`\`\``);
        done();
      }

      server.userinfo({sendMessage}, msg);
    });

    it('should return user info for a mentioned user', done => {
      let msg = {
        mentions: [{
          username: 'user',
          id: 1,
          discriminator: 1234,
          status: 'online',
          joined: 'Sun, 27 Sep 2015 19:32:46 GMT',
          avatarURL: 'http://website.com/img.png'
        }],
        channel: {
          server: {
            name: 'server',
            detailsOfUser: () => {
              return {joinedAt: 'Sun, 27 Sep 2015 19:32:46 GMT'};
            }
          }
        }
      };

      function sendMessage(channel, res) {
        channel.should.equal(msg.channel);
        res.should.equal(`\`\`\`Name: user
ID: 1
Discriminator: 1234
Status: online
Joined server: Sun, 27 Sep 2015 19:32:46 GMT
Avatar: http://website.com/img.png
\`\`\``);
        done();
      }

      server.userinfo({sendMessage}, msg);
    });
  });

  describe('uptime', () => {
    it('should return a string containing uptime information', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal(`I have been alive for:
67 Hours
19 Minutes
2 Seconds`);
        done();
      }

      server.uptime({sendMessage, uptime: 242342345}, {channel: 'test'});
    });
  });

  describe('version', () => {
    it('should return the change log for the latest verion', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal(`1.2.3 (Janurary 8th, 2016)

Features
- Test One

Bug Fixes
- Test Two

Technical Features
- Test Three`);
        done();
      }

      nock('https://raw.githubusercontent.com/')
        .get('/Gravestorm/Gravebot/master/CHANGELOG.md')
        .reply(200, res_fixture);

      server.version({sendMessage}, {channel: 'test'});
    });
  });
});
