import chai from 'chai';

import info from '../../src/commands/info/index';


chai.should();

describe('info', () => {
  describe('avatar', () => {
    it('should return a url to an avatar for self', () => {
      const evt = {
        message: {
          mentions: {},
          author: {
            avatarURL: 'http://test.dev/img.jpg'
          }
        }
      };
      return info.avatar({}, evt)
      .then(res => res.should.equal('Your avatar:\nhttp://test.dev/img.jpg'));
    });

    it('should return a url to an avatar for a mentioned user', () => {
      const evt = {
        message: {
          mentions: [{
            avatarURL: 'http://test.dev/img.jpg',
            username: 'user'
          }]
        }
      };
      return info.avatar({}, evt, 'user')
      .then(res => res[0].should.equal('user\'s avatar:\nhttp://test.dev/img.jpg'));
    });
  });

  describe('channelinfo', () => {
    it('should return a string containing channel information', () => {
      const evt = {
        message: {
          content: '',
          guild: {
            name: 'server'
          },
          channel: {
            isPrivate: false,
            name: 'test',
            id: '1234',
            type: 0,
            position: '2',
            messages: ['msg'],
            createdAt: 'Wed Aug 12 2015 17:11:00 GMT+0300 (EEST)',
            topic: 'abc'
          }
        }
      };
      return info.channelinfo({}, evt)
      .then(res => res[0].should.equal(`\`\`\`Server: server
Name: test
ID: 1234
Type: 0
Position: 2
New Messages: 1 (since the bot was restarted)
Created At: Wed Aug 12 2015 17:11:00 GMT+0300 (EEST)
Topic: abc
\`\`\``));
    });

    it('should return a string containing mentioned channel information', () => {
      const channel = {
        isPrivate: false,
        name: 'test',
        id: '9876543210',
        type: 0,
        position: '2',
        messages: ['msg'],
        createdAt: 'Wed Aug 12 2015 17:11:00 GMT+0300 (EEST)',
        topic: 'abc',
        guild: {name: 'server'}
      };

      const evt = {
        message: {
          content: '<#9876543210>',
          guild: {
            channels: [channel],
            name: 'server'
          },
          channel
        }
      };
      return info.channelinfo({}, evt, '<#9876543210>')
      .then(res => res[0].should.equal(`\`\`\`Server: server
Name: test
ID: 9876543210
Type: 0
Position: 2
New Messages: 1 (since the bot was restarted)
Created At: Wed Aug 12 2015 17:11:00 GMT+0300 (EEST)
Topic: abc
\`\`\``));
    });
  });

  describe('serverinfo', () => {
    it('should return a string containing server information', () => {
      const evt = {
        message: {
          channel: {
            isPrivate: false
          },
          guild: {
            name: 'test',
            id: '1234',
            region: 'london',
            owner: {
              username: 'user'
            },
            channels: ['channel'],
            textChannels: [0],
            voiceChannels: [2],
            generalChannel: {
              name: 'general'
            },
            afk_channel: {
              name: 'afk'
            },
            afk_timeout: '3600',
            members: ['user'],
            createdAt: 'Wed Aug 12 2015 17:11:00 GMT+0300 (EEST)',
            roles: [{name: '@everyone'}, {name: 'role1'}, {name: 'role2'}],
            iconURL: 'http://website.com/img.png'
          }
        }
      };
      return info.serverinfo({}, evt)
      .then(res => res[0].should.equal(`\`\`\`Name: test
ID: 1234
Region: london
Owner: user
Channels: 1 (1 text & 1 voice)
Default Channel: general
AFK Channel: afk
AFK Timeout: 60 minutes
Members: 1
Created At: Wed Aug 12 2015 17:11:00 GMT+0300 (EEST)
Roles: role1, role2
Icon: \`\`\`http://website.com/img.png`));
    });
  });


  describe('userinfo', () => {
    it('should return user info for requesting user', () => {
      const evt = {
        message: {
          channel: {
            isPrivate: false
          },
          mentions: {},
          author: {
            username: 'user',
            id: '1',
            discriminator: '1234',
            status: 'online',
            gameName: 'game',
            registeredAt: 'Wed Aug 12 2015 17:11:00 GMT+0300 (EEST)',
            avatarURL: 'http://website.com/img.png'
          }
        }
      };
      return info.userinfo({}, evt)
      .then(res => res[0].should.equal(`\`\`\`Name: user
ID: 1
Discriminator: 1234
Status: online (Playing game)
Registered At: Wed Aug 12 2015 17:11:00 GMT+0300 (EEST)
Avatar: \`\`\`http://website.com/img.png`));
    });

    it('should return user info for a mentioned user', () => {
      const evt = {
        message: {
          channel: {
            isPrivate: false
          },
          mentions: [{
            username: 'user',
            id: '1',
            discriminator: '1234',
            status: 'online',
            gameName: 'game',
            registeredAt: 'Wed Aug 12 2015 17:11:00 GMT+0300 (EEST)',
            avatarURL: 'http://website.com/img.png'
          }]
        }
      };
      return info.userinfo({}, evt, 'user')
      .then(res => res[0].should.equal(`\`\`\`Name: user
ID: 1
Discriminator: 1234
Status: online (Playing game)
Registered At: Wed Aug 12 2015 17:11:00 GMT+0300 (EEST)
Avatar: \`\`\`http://website.com/img.png`));
    });
  });
});
