import chai from 'chai';
import sinon from 'sinon';

import roll from '../../src/commands/fun/roll';


chai.should();

describe('roll', () => {
  it('should return a description for the roll', () => {
    const sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 2);

    const evt = {message: {author: {mention: 'user'}}};
    return roll.roll({}, evt, '4 3')
      .then(res => {
        res.should.equal(`user rolled a 3 sided dice 4 times for a total of **28** (average: 7):
7,7,7,7`);
        sandbox.restore();
      });
  });
});
