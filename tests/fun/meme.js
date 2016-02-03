import chai from 'chai';
import mockery from 'mockery';
import nconf from 'nconf';


let meme;
chai.should();

describe('meme', () => {
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
    meme = require('../../src/commands/fun/meme').default;
  });

  after(() => {
    mockery.disable();
  });

  it('should generate a meme and return a image url', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('http://url.dev/img.png');
      done();
    }

    nconf.set('IMGFLIP_USERNAME', '123');
    nconf.set('IMGFLIP_PASSWORD', '123');
    meme.meme({sendMessage}, {channel: 'test'}, 'wonka "top text" "bottom text"');
  });
});
