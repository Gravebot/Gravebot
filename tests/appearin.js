import chai from 'chai';
import sinon from 'sinon';

import appearin from '../lib/appearin';

chai.should();

describe('appearin', () => {
  it('should return a description for the roll', done => {
    const sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.234342344890234089234089);

    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('https://appear.in/0234342344');

      sandbox.restore();
      done();
    }

    appearin.appearin({sendMessage}, {channel: 'test'});
  });
});
