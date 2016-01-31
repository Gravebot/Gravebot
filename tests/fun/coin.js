import chai from 'chai';

import coin from '../lib/fun/coin';


chai.should();

describe('coin', () => {
  it('should return heads', done => {
    function sendFile(channel, res) {
      channel.should.equal('test');
      res.should.equal('./images/Heads.png');
      done();
    }

    coin.coin({sendFile}, {channel: 'test'});
  });
});
