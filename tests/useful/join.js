import join from '../../lib/useful/join';


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
    join.join({sendMessage, joinServer}, {channel: 'test', content: invite_url}, invite_url);
  });
});
