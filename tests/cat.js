import chai from 'chai';
import cat from '../lib/cat';
import nock from 'nock';

chai.should();
const res_fixture = require('./fixtures/randomcat.json');

describe('cat', () => {
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

    cat.cat({sendMessage}, {channel: 'test'});
  });
});
