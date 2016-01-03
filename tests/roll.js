import chai from 'chai';
import sinon from 'sinon';
import roll from '../lib/roll';

chai.should();

describe('roll', () => {
  it('should return a description for the roll', done => {
    const sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 2);

    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal(`user rolled a 3 sided dice 4 times for a total of 28 (average: 7):
7,7,7,7`);

      sandbox.restore();
      done();
    }

    roll.roll({sendMessage}, {author: 'user', channel: 'test', content: '!roll 4 3'}, '4 3');
  });
});
