import chai from 'chai';
import nock from 'nock';
import path from 'path';

import images from '../../lib/fun/images';


chai.should();
const res_fixture_cat = require(path.join(__dirname, '../fixtures/cat.json'));
const res_fixture_pug = require(path.join(__dirname, '../fixtures/pug.json'));
const res_fixture_pugbomb = require(path.join(__dirname, '../fixtures/pugbomb.json'));

describe('images', () => {
  describe('cat', () => {
    it('should return cat images', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://random.cat/i/7VnxKqw.jpg');
        done();
      }

      nock.cleanAll();
      nock('http://random.cat')
        .get('/meow.php')
        .reply(200, res_fixture_cat);

      images.cat({sendMessage}, {channel: 'test'});
    });

    it('should return 5 cat images', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal(`http://random.cat/i/7VnxKqw.jpg
http://random.cat/i/7VnxKqw.jpg
http://random.cat/i/7VnxKqw.jpg
http://random.cat/i/7VnxKqw.jpg
http://random.cat/i/7VnxKqw.jpg`);
        done();
      }

      nock.cleanAll();
      nock('http://random.cat')
        .get('/meow.php')
        .times(5)
        .reply(200, res_fixture_cat);

      images.cat({sendMessage}, {channel: 'test'}, 'bomb 5');
    });
  });

  describe('pug', () => {
    it('should return pug images', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal(`http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg`);
        done();
      }

      nock.cleanAll();
      nock('https://pugme.herokuapp.com')
        .get('/bomb?count=1')
        .reply(200, res_fixture_pug);

      images.pug({sendMessage}, {channel: 'test'});
    });

    it('should return 5 pug images', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal(`http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg
http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg
http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg
http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg
http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg`);
        done();
      }

      nock.cleanAll();
      nock('https://pugme.herokuapp.com')
        .get('/bomb?count=5')
        .reply(200, res_fixture_pugbomb);

      images.pug({sendMessage}, {channel: 'test'}, 'bomb 5');
    });
  });
});
