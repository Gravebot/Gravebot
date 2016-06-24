import chai from 'chai';
import nock from 'nock';
import path from 'path';

import images from '../../src/commands/fun/animals';


chai.should();
const res_fixture_cat = require(path.join(__dirname, '../fixtures/cat.json'));
const res_fixture_snake = require(path.join(__dirname, '../fixtures/snake.json'));

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
