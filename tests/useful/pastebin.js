import chai from 'chai';
import nconf from 'nconf';
import nock from 'nock';

import pastebin from '../../lib/useful/pastebin';


chai.should();

describe('pastebin', () => {
  before(() => {
    nconf.set('PASTEBIN_KEY', '123');
  });

  it('should return a url to a paste', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('http://pastebin.com/EcYgmBpk');
      done();
    }

    nock.cleanAll();
    nock('http://pastebin.com')
      .post('/api/api_post.php', {api_dev_key: nconf.get('PASTEBIN_KEY'), api_option: 'paste', api_paste_code: 'test'})
      .reply(200, 'http://pastebin.com/EcYgmBpk');

    pastebin.paste({sendMessage}, {channel: 'test'}, 'test');
  });
});
