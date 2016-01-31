import chai from 'chai';
import nock from 'nock';
import path from 'path';

import images from '../lib/fun/images';


chai.should();
const res_fixture_cat = require('./fixtures/randomcat.json');
const res_fixture_pug = require(path.join(__dirname, './fixtures/pugbomb.json'));

describe('comics', () => {
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
        .reply(200, res_fixture_cat);

      images.cat({sendMessage}, {channel: 'test'});
    });

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
          .reply(200, res_fixture_pug);

        images.pugbomb({sendMessage}, {channel: 'test'});
      });
    });
  });
});
