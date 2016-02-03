/**import chai from 'chai';

import append from '../lib/append';

chai.should();

describe('append', () => {

  it('should append content to a previous message', done => {
    let msgs = [{content: 'hello'},
                  {content: '!'}];

    let msg = {
      author: 'user',
      channel: {
        messages:{
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
**/
import chai from 'chai';
import append from '../lib/append';
