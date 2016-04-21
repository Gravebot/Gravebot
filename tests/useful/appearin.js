import chai from 'chai';
import sinon from 'sinon';

import appearin from '../../src/commands/useful/appearin';


let sandbox;
chai.should();

describe('appearin', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
  });

  after(() => sandbox.restore());

  it('should return a appearin URL to the channel', () => {
    const evt = {
      message: {
        mentions: []
      }
    };
    return appearin.appearin({}, evt)
    .then(res => res.should.equal('https://appear.in/0234342344'));
  });

  it('should return a appearin url to the author and mentioned users in PMs', done => {
    let testcount = 0;

    function sendMessage(res) {
      testcount++;
      if (testcount === 1) {
        res.should.equal('https://appear.in/0234342344');
      } else {
        res.should.equal('sender would like you to join a videocall/screenshare.\nhttps://appear.in/0234342344');
      }
      if (testcount === 2) done();
    }

    const client = {
      Users: {
        get: () => ({
          openDM: () => Promise.resolve({sendMessage})
        })
      }
    };

    const evt = {
      message: {
        author: {
          username: 'sender',
          id: 1234
        },
        mentions: [{
          username: 'recipient'
        }]
      }
    };

    return appearin.appearin(client, evt);
  });
});
