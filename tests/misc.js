import chai from 'chai';
import sinon from 'sinon';

import misc from '../lib/misc';

let sandbox;
chai.should();

describe('misc', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
  });

  after(() => sandbox.restore());

  describe('8ball', () => {
    it('should return an answer', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('author:crystal_ball:**In your dreams**:crystal_ball:');
        done();
      }

      misc.eightball({sendMessage}, {channel: 'test', author: 'author'}, 'Should I eat a burger?');
    });
  });

  describe('coin', () => {
    it('should return heads', done => {
      function sendFile(channel, res) {
        channel.should.equal('test');
        res.should.equal('./images/Heads.png');
        done();
      }

      misc.coin({sendFile}, {channel: 'test'});
    });
  });

  describe('decide', () => {
    it('should pick hotdogs', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('I would choose **hotdogs**');
        done();
      }

      misc.decide({sendMessage}, {channel: 'test', author: 'author'}, 'hotdogs or burgers?');
    });
  });

  describe('quote', () => {
    it('should return quote 4', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('How is it one careless match can start a forest fire, but it takes a whole box to start a campfire?');
        done();
      }

      misc.quote({sendMessage}, {channel: 'test', author: 'author'}, '4');
    });

    it('should return a random quote', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('I asked God for a bike, but I know God doesn’t work that way. So I stole a bike and asked for forgiveness. - *Emo Philips*');
        done();
      }

      misc.quote({sendMessage}, {channel: 'test', author: 'author'});
    });
  });
});
