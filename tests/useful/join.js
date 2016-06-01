import join from '../../src/commands/useful/join';


describe('join/join-server', () => {
  it('should join execute joinServer and respond with with a success message', done => {
    function reply(res) {
      res.should.equal(`To invite me to your server, click the link below and select a server.
Only users with **Manage Server** permission in that server are able to invite me to it.
You may remove some of the permissions if you wish, but be warned it may break current and upcoming features.
https://discordapp.com/oauth2/authorize?&client_id=123&scope=bot&permissions=268561430`);
      done();
    }

    return join.join({}, {message: {reply}});
  });
});
