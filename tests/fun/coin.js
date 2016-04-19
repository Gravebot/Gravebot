import chai from 'chai';
import sinon from 'sinon';

import coin from '../../src/commands/fun/coin';


let sandbox;
chai.should();

describe('coin', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
  });

  after(() => sandbox.restore());

  it('should return heads', () => {
    return coin.coin()
      .then(res => {
        res.upload.should.equal('./images/Heads.png');
      });
  });
});
