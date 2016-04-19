import chai from 'chai';
import fs from 'fs';
import nock from 'nock';
import path from 'path';

import info from '../src/commands/info';


chai.should();
const res_fixture = fs.readFileSync(path.join(__dirname, './fixtures/version.md'));

describe('info', () => {
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

      info.avatar({sendMessage}, msg);
    });

    it('should return a url to an avatar for a mentioned user', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('test\'s avatar:\nhttp://test.dev/img.jpg');
        done();
      }

      let msg = {
        channel: 'test',
        author: {},
        mentions: [{
          avatarURL: 'http://test.dev/img.jpg',
          username: 'test'
        }]
      };

      info.avatar({sendMessage}, msg);
    });
  });

  describe('serverinfo', () => {
    it('should return a string containing server information', done => {
      function sendMessage(channel, res) {
        channel.should.equal(channel);
        res.should.equal(`\`\`\`Name: test
ID: 1234
Region: london
Owner: user
Channels: 1
Default Channel: abc
AFK Channel: abc
Members: 1
Roles: role1, role2
Icon: http://website.com/img.png
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
          afkChannel: {
            name: 'abc'
          },
          roles: [{name: '@everyone'}, {name: 'role1'}, {name: 'role2'}],
          iconURL: 'http://website.com/img.png',
          members: ['user']
        }
      };

      info.serverinfo({sendMessage}, {channel});
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

      info.serverlist({sendMessage, servers}, {channel: 'test'});
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

      info.servers(bot, {channel: 'test'});
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

      info.userinfo({sendMessage}, msg);
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

      info.userinfo({sendMessage}, msg);
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

      info.uptime({sendMessage, uptime: 242342345}, {channel: 'test'});
    });
  });

  describe('version', () => {
    it('should return the change log for the latest verion', () => {
      nock('https://raw.githubusercontent.com/')
        .get('/Gravestorm/Gravebot/master/CHANGELOG.md')
        .reply(200, res_fixture);

      return info.version()
        .then(res => {
          res.should.equal(`1.2.3 (Janurary 8th, 2016)

Features
- Test One

Bug Fixes
- Test Two

Technical Features
- Test Three`);
        });
    });
  });
});
