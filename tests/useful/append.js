
import chai from 'chai';
import append from '../../lib/useful/append';

chai.should();

describe('append', () => {
  it('should append content to a previous message', done => {
    const msgs = [{content: 'hello'},
    {content: '!'}];

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

    function sendMessage(channel, res) {
      channel.should.equal(msg.channel);
      res.should.equal('hello world');
      done();
    }

    append.append({sendMessage}, msg, ' world');
  });
});
