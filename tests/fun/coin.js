import chai from 'chai';
import sinon from 'sinon';

import coin from '../../lib/fun/coin';


let sandbox;
chai.should();

describe('coin', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
  });

  after(() => sandbox.restore());

  it('should return heads', done => {
    function sendFile(channel, res) {
      channel.should.equal('test');
      res.should.equal('./images/Heads.png');
      done();
    }

    coin.coin({sendFile}, {channel: 'test'});
  });
});
