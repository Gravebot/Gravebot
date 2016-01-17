import Promise from 'bluebird';
import chai from 'chai';

import help from '../lib/help';
import english from '../lib/help/english';
import french from '../lib/help/french';
import meme from '../lib/help/meme';

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

    let msg = {channel: 'test', author: 'author'};
    help[func]({sendMessage}, msg, cmd);
  });
}

describe('help', () => {
  describe('aide', () => {
    describe('fun', () => {
      it('should return the correct help text', done => {
        isString('aide', 'test', french.fun, 1, 'fun').asCallback(done);
      });
    });

    describe('utile', () => {
      it('should return the correct help text', done => {
        isString('aide', 'test', french.useful, 1, 'utile').asCallback(done);
      });
    });

    describe('info', () => {
      it('should return the correct help text', done => {
        isString('aide', 'test', french.info, 1, 'info').asCallback(done);
      });
    });

    describe('jeux', () => {
      it('should return the correct help text', done => {
        isString('aide', 'test', english.games, 1, 'jeux').asCallback(done);
      });
    });

    describe('autres', () => {
      it('should return the correct help text', done => {
        isString('aide', 'test', english.other, 1, 'autres').asCallback(done);
      });
    });


    describe('none', () => {
      it('should return the correct help text', done => {
        isString('aide', 'test', english.other, 1, '').asCallback(done);
      });
    });
  });

  describe('commands', () => {
    it('should return a string', done => {
      isString('commands', 'test', english.all, 1).asCallback(done);
    });
  });

  describe('help', () => {
    describe('fun', () => {
      it('should return the correct help text', done => {
        isString('help', 'test', english.fun, 1, 'fun').asCallback(done);
      });
    });

    describe('useful', () => {
      it('should return the correct help text', done => {
        isString('help', 'test', english.useful, 1, 'useful').asCallback(done);
      });
    });

    describe('info', () => {
      it('should return the correct help text', done => {
        isString('help', 'test', english.info, 1, 'info').asCallback(done);
      });
    });

    describe('games', () => {
      it('should return the correct help text', done => {
        isString('help', 'test', english.games, 1, 'games').asCallback(done);
      });
    });

    describe('other', () => {
      it('should return the correct help text', done => {
        isString('help', 'test', english.other, 1, 'other').asCallback(done);
      });
    });

    describe('none', () => {
      it('should return the correct help text', done => {
        isString('help', 'test', english.all, 1, '').asCallback(done);
      });
    });
  });

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
