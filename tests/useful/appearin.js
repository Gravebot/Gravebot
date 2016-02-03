import chai from 'chai';
import sinon from 'sinon';

import appearin from '../../lib/useful/appearin';


let sandbox;
chai.should();

describe('appearin', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
  });

  after(() => sandbox.restore());

  it('should return a appearin URL to the channel', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('https://appear.in/0234342344');
      done();
    }

    appearin.appearin({sendMessage}, {channel: 'test', mentions: []});
  });

  it('should return a appearin url to the author and mentioned users in PMs', done => {
    let msg = {
      channel: 'test',
      mentions: [{name: 'usertest'}],
      author: {
        name: 'authortest'
      }
    };

    let testcount = 0;

    function sendMessage(channel, res) {
      testcount++;
      if (testcount === 1) {
        channel.should.equal(msg.author);
        res.should.equal('https://appear.in/0234342344');
      } else {
        channel.should.equal(msg.mentions[0]);
        res.should.equal('authortest would like you to join a videocall/screenshare.\nhttps://appear.in/0234342344');
      }

      if (testcount === 2) done();
    }

    appearin.appearin({sendMessage}, msg);
  });
});
