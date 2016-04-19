import chai from 'chai';
import nock from 'nock';
import path from 'path';

import images from '../../src/commands/fun/animals';


chai.should();
const res_fixture_cat = require(path.join(__dirname, '../fixtures/cat.json'));
const res_fixture_pug = require(path.join(__dirname, '../fixtures/pug.json'));
const res_fixture_snake = require(path.join(__dirname, '../fixtures/snake.json'));
const res_fixture_pugbomb = require(path.join(__dirname, '../fixtures/pugbomb.json'));

describe('images', () => {
  describe('cat', () => {
    it('should return cat images', () => {
      nock.cleanAll();
      nock('http://random.cat')
        .get('/meow.php')
        .reply(200, res_fixture_cat);

      return images.cat()
        .then(res => res.should.equal('http://random.cat/i/7VnxKqw.jpg'));
    });

    it('should return 5 cat images', () => {
      nock.cleanAll();
      nock('http://random.cat')
        .get('/meow.php')
        .times(5)
        .reply(200, res_fixture_cat);

      return images.cat({}, {}, 'bomb 5').then(res => {
        res.should.equal(`http://random.cat/i/7VnxKqw.jpg
http://random.cat/i/7VnxKqw.jpg
http://random.cat/i/7VnxKqw.jpg
http://random.cat/i/7VnxKqw.jpg
http://random.cat/i/7VnxKqw.jpg`);
      });
    });
  });

  describe('pug', () => {
    it('should return pug images', () => {
      nock.cleanAll();
      nock('http://pugme.herokuapp.com')
        .get('/bomb?count=1')
        .reply(200, res_fixture_pug);

      return images.pug()
        .then(res => res.should.equal(`http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg`));
    });

    it('should return 5 pug images', () => {
      nock.cleanAll();
      nock('http://pugme.herokuapp.com')
        .get('/bomb?count=5')
        .reply(200, res_fixture_pugbomb);

      return images.pug({}, {}, 'bomb 5').then(res => {
        res.should.equal(`http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg
http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg
http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg
http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg
http://30.media.tumblr.com/tumblr_lj50gs8rAX1qaa50yo1_500.jpg`);
      });
    });
  });

  describe('snake', () => {
    it('should return snake images', () => {
      nock.cleanAll();
      nock('http://fur.im/snek')
        .get('/snek.php')
        .reply(200, res_fixture_snake);

      return images.snake()
        .then(res => res.should.equal('http://fur.im/snek/61.png'));
    });

    it('should return 5 snake images', () => {
      nock.cleanAll();
      nock('http://fur.im/snek')
        .get('/snek.php')
        .times(5)
        .reply(200, res_fixture_snake);

      return images.snake({}, {}, 'bomb 5').then(res => {
        res.should.equal(`http://fur.im/snek/61.png
http://fur.im/snek/61.png
http://fur.im/snek/61.png
http://fur.im/snek/61.png
http://fur.im/snek/61.png`);
      });
    });
  });
});
