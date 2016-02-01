import chai from 'chai';
import sinon from 'sinon';

import eightball from '../../lib/fun/8ball';

let sandbox;
chai.should();

describe('8ball', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
  });

  after(() => sandbox.restore());

  it('should return an answer', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('author:crystal_ball:**In your dreams**:crystal_ball:');
      done();
    }

    eightball.eightball({sendMessage}, {channel: 'test', author: 'author'}, 'Should I eat a burger?');
  });
});
