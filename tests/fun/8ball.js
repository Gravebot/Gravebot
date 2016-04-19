import chai from 'chai';
import sinon from 'sinon';

import eightball from '../../src/commands/fun/8ball';


let sandbox;
chai.should();

describe('8ball', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
  });

  after(() => sandbox.restore());

  it('should return an answer', () => {
    return eightball.eightball({}, {}, 'Should I eat a burger?')
      .then(res => res.should.equal(`🎱 **In your dreams** 🎱`));
  });
});
