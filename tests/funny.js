import chai from 'chai';
import mockery from 'mockery';
import nconf from 'nconf';
import sinon from 'sinon';


chai.should();
let funny;

describe('funny', () => {
  before(() => {
    class _Imgflipper {
      constructor() {}

      generateMeme(meme_type, top_text, bottom_text, next) {
        next(null, 'http://url.dev/img.png');
      }
    }

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });
    mockery.registerMock('imgflipper', _Imgflipper);
    funny = require('../lib/funny').default;
  });

  after(() => {
    mockery.disable();
  });

  describe('drama', () => {
    it('should return drama image at index 3', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/GbIaoT0.gif');
        done();
      }

      funny.drama({sendMessage}, {channel: 'test'}, '3');
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

      funny.drama({sendMessage}, {channel: 'test'}, '1000');
    });
  });

  describe('emoji', () => {
    it('should return emoji text from index 2', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('💀💀💀💀🎺🎺🎺NOW WATCH ME SPOOK💀💀💀NOW WATCH ME DOOT DOOT🎺🎺🎺🎺NOW WATCH ME SPOOK SPOOK💀💀💀💀💀🎺🎺🎺🎺WATCH ME DOOT DOOT💀🎺🎺💀🎺💀🎺🎺💀');
        done();
      }

      funny.emoji({sendMessage}, {channel: 'test'}, '2');
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

      funny.emoji({sendMessage}, {channel: 'test'}, '1000');
    });
  });

  describe('meme', () => {
    it('should generate a meme and return a image url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://url.dev/img.png');
        done();
      }

      nconf.set('IMGFLIP_USERNAME', '123');
      nconf.set('IMGFLIP_PASSWORD', '123');
      funny.meme({sendMessage}, {channel: 'test'}, 'wonka "top text" "bottom text"');
    });
  });
});
