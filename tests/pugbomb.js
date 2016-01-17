import chai from 'chai';
import nock from 'nock';
import path from 'path';

import pugbomb from '../lib/pugbomb';

chai.should();
const res_fixture = require(path.join(__dirname, './fixtures/pugbomb.json'));

describe('pugbomb', () => {
  it('should return 5 pug images', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal(`http://29.media.tumblr.com/tumblr_ll267csxAQ1qb08qmo1_500.jpg
http://25.media.tumblr.com/tumblr_mclncuZUso1qb08qmo1_500.jpg
http://28.media.tumblr.com/tumblr_lk8iieigtQ1qzj3syo1_500.jpg
http://38.media.tumblr.com/tumblr_mc4u6lwZHr1qf4k86o1_500.jpg
http://29.media.tumblr.com/tumblr_lsvcpxVBgd1qzgqodo1_500.jpg`);
      done();
    }

    nock.cleanAll();
    nock('https://pugme.herokuapp.com')
      .get('/bomb?count=5')
      .reply(200, res_fixture);

    pugbomb.pugbomb({sendMessage}, {channel: 'test'});
  });
});
