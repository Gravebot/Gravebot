import Promise from 'bluebird';
import chai from 'chai';

import help from '../src/commands/help';
import meme from '../src/commands/help/meme';


chai.should();

function isString(func, chnl, response, count, cmd) {
  let current_calls = 0;

  return new Promise((resolve, reject) => {
    function sendMessage(channel, res) {
      channel.should.equal(chnl);
      res.should.be.a('string');

      current_calls++;
      if (current_calls === count) return resolve();
    }

    const msg = {channel: 'test', author: 'author'};
    help[func]({sendMessage}, msg, cmd);
  });
}

describe('help', () => {
  describe('memelist', () => {
    describe('1', () => {
      it('should return the correct help text', done => {
        isString('memelist', 'author', meme.list1, 1, '1').asCallback(done);
      });
    });

    describe('2', () => {
      it('should return the correct help text', done => {
        isString('memelist', 'author', meme.list2, 1, '2').asCallback(done);
      });
    });

    describe('3', () => {
      it('should return the correct help text', done => {
        isString('memelist', 'author', meme.list3, 1, '3').asCallback(done);
      });
    });

    describe('full', () => {
      it('should return the correct help text in three different messages', done => {
        let count = 0;

        function sendMessage(channel, res) {
          count++;
          channel.should.equal('author');
          res.should.equal(meme[`list${count}`]);
          if (count === 3) return done();
        }

        help.memelist({sendMessage}, {author: 'author'}, 'full');
      });
    });

    describe('none', () => {
      it('should return the correct help text', done => {
        isString('memelist', 'test', meme.all, 1, '').asCallback(done);
      });
    });
  });
});
