import chai from 'chai';

import eightball from '../lib/fun/8ball';


chai.should();

describe('8ball', () => {
  it('should return an answer', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('author:crystal_ball:**In your dreams**:crystal_ball:');
      done();
    }

    eightball.eightball({sendMessage}, {channel: 'test', author: 'author'}, 'Should I eat a burger?');
  });
});
