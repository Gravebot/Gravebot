import chai from 'chai';
import sinon from 'sinon';

import responses from '../lib/fun/responses';


chai.should();

describe('drama', () => {
  it('should return drama image at index 3', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('http://i.imgur.com/GbIaoT0.gif');
      done();
    }

    responses.drama({sendMessage}, {channel: 'test'}, '3');
  });

  it('should return a random drama image', done => {
    let sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.6787224733270705);
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('http://i.imgur.com/OX2r7f3.gif');

      sandbox.restore();
      done();
    }

    responses.drama({sendMessage}, {channel: 'test'}, '1000');
  });
});

describe('emoji', () => {
  it('should return emoji text from index 2', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('💀💀💀💀🎺🎺🎺NOW WATCH ME SPOOK💀💀💀NOW WATCH ME DOOT DOOT🎺🎺🎺🎺NOW WATCH ME SPOOK SPOOK💀💀💀💀💀🎺🎺🎺🎺WATCH ME DOOT DOOT💀🎺🎺💀🎺💀🎺🎺💀');
      done();
    }

    responses.emoji({sendMessage}, {channel: 'test'}, '2');
  });

  it('should return random emoji text', done => {
    let sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.6787224733270705);
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('😬😳🙊😥😬🙊🙊🙊😬😥 awkward shit awkward sHit😬 thats 🙊some awkward😬😬shit right😬😬th 😬 ere😬😬😬 right💬there 💬💬if i do ƽaү so my selｆ 😳 i say so 😳 thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ🙊 😬😬😬НO0ОଠＯOOＯOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ😬😬 😬 🙊 😬😥🙊🙊😬😬awkward shit');

      sandbox.restore();
      done();
    }

    responses.emoji({sendMessage}, {channel: 'test'}, '1000');
  });
});

describe('quote', () => {
  it('should return quote 4', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('How is it one careless match can start a forest fire, but it takes a whole box to start a campfire?');
      done();
    }

    responses.quote({sendMessage}, {channel: 'test', author: 'author'}, '4');
  });

  it('should return a random quote', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('I asked God for a bike, but I know God doesn’t work that way. So I stole a bike and asked for forgiveness. - *Emo Philips*');
      done();
    }

    responses.quote({sendMessage}, {channel: 'test', author: 'author'});
  });
});
