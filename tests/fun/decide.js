import chai from 'chai';
import sinon from 'sinon';

import decide from '../../lib/fun/decide';


let sandbox;
chai.should();

describe('decide', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
  });

  after(() => sandbox.restore());

  it('should pick hotdogs', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('I would choose **hotdogs**');
      done();
    }

    decide.decide({sendMessage}, {channel: 'test', author: 'author'}, 'hotdogs or burgers?');
  });
});
