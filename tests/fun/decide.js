import chai from 'chai';
import sinon from 'sinon';

import decide from '../../src/commands/fun/decide';


let sandbox;
chai.should();

describe('decide', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
  });

  after(() => sandbox.restore());

  it('should pick hotdogs', () => {
    return decide.decide({}, {}, 'hotdogs or burgers?')
      .then(res => res.should.equal('I would choose **hotdogs**'));
  });
});
