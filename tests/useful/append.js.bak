import chai from 'chai';
import append from '../../src/commands/useful/append';

chai.should();
describe('append', () => {
  const msgs = [{content: '!quote'},
    {content: '!! 1'}];
  const msg = {
    author: 'user',
    channel: {
      messages: {
        getAll: () => {
          return msgs;
        }
      }
    }
  };

  it('should append content to a previous message', done => {
    function sendMessage(channel, res) {
      channel.should.equal(msg.channel);
      res.should.equal("Don't let your dreams be memes. - *Shia LaBeouf*");
      done();
    }
    append.append({sendMessage}, msg, ' 1');
  });
});
