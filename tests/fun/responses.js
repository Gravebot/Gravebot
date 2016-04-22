import chai from 'chai';
import sinon from 'sinon';

import responses from '../../src/commands/fun/responses';


let sandbox;
chai.should();

describe('responses', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.6787224733270705);
  });

  after(() => sandbox.restore());

  describe('drama', () => {
    it('should return drama image at index 3', () => {
      return responses.drama({}, {}, '3')
        .then(res => res.should.equal('http://i.imgur.com/GbIaoT0.gif'));
    });

    it('should return a random drama image', () => {
      return responses.drama({}, {}, '1000')
        .then(res => res.should.equal('http://i.imgur.com/OX2r7f3.gif'));
    });
  });

  describe('emoji', () => {
    it('should return emoji text from index 2', () => {
      return responses.emoji({}, {}, '2')
        .then(res => res.should.equal('💀💀💀💀🎺🎺🎺NOW WATCH ME SPOOK💀💀💀NOW WATCH ME DOOT DOOT🎺🎺🎺🎺NOW WATCH ME SPOOK SPOOK💀💀💀💀💀🎺🎺🎺🎺WATCH ME DOOT DOOT💀🎺🎺💀🎺💀🎺🎺💀'));
    });

    it('should return random emoji text', () => {
      return responses.emoji({}, {}, '1000')
        .then(res => res.should.equal('😬😳🙊😥😬🙊🙊🙊😬😥 awkward shit awkward sHit😬 thats 🙊some awkward😬😬shit right😬😬th 😬 ere😬😬😬 right💬there 💬💬if i do ƽaү so my selｆ 😳 i say so 😳 thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ🙊 😬😬😬НO0ОଠＯOOＯOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ😬😬 😬 🙊 😬😥🙊🙊😬😬awkward shit'));
    });
  });

  describe('quote', () => {
    it('should return quote 4', () => {
      return responses.quote({}, {}, '4')
        .then(res => res.should.equal('How is it one careless match can start a forest fire, but it takes a whole box to start a campfire?'));
    });

    it('should return a random quote', () => {
      return responses.quote({}, {})
        .then(res => res.should.equal('My favorite machine at the gym is the vending machine.'));
    });
  });
});
