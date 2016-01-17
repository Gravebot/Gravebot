import chai from 'chai';
import randomcat from '../lib/randomcat';
import nock from 'nock';

chai.should();
const res_fixture = require('./fixtures/randomcat.json');

describe('randomcat', () => {
  it('should return a cat picture', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('http://random.cat/i/067_-_1yzs4wL.gif');
      done();
    }

    nock.cleanAll();
    nock('http://random.cat')
      .get('/meow.php')
      .reply(200, res_fixture);

    randomcat.randomcat({sendMessage}, {channel: 'test'});
  });
});
