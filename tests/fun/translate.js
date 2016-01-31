import chai from 'chai';
import fs from 'fs';
import nock from 'nock';
import path from 'path';
import yoda from '../lib/yoda';

chai.should();
const res_fixture = fs.readFileSync(path.join(__dirname, './fixtures/yoda.html'));

describe('yoda', () => {
  it('shoud return converted text', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('Hello, to the store lets go. ');
      done();
    }

    nock.cleanAll();
    nock('http://www.yodaspeak.co.uk')
      .post('/index.php')
      .reply(200, res_fixture);

    yoda.yoda({sendMessage}, {channel: 'test'}, 'Hello, lets go to the store.');
  });
});
