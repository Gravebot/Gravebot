import chai from 'chai';

import help from '../src/commands/help';
import meme from '../src/commands/help/meme';


chai.should();

describe('help', () => {
  describe('memelist', () => {
    describe('1', () => {
      it('should return the correct help text', () => {
        const evt = {
          message: {
            author: {
              id: '1234'
            }
          }
        };
        return help.memelist({}, evt, '1')
        .then(res => res.should.equal(meme.list1));
      });
    });

    describe('2', () => {
      it('should return the correct help text', () => {
        const evt = {
          message: {
            author: {
              id: '1234'
            }
          }
        };
        return help.memelist({}, evt, '2')
        .then(res => res.should.equal(meme.list2));
      });
    });

    describe('3', () => {
      it('should return the correct help text', () => {
        const evt = {
          message: {
            author: {
              id: '1234'
            }
          }
        };
        return help.memelist({}, evt, '3')
        .then(res => res.should.equal(meme.list3));
      });
    });

    describe('full', () => {
      it('should return the correct help text in three different messages', () => {
        const evt = {
          message: {
            author: {
              id: '1234'
            }
          }
        };
        return help.memelist({}, evt, 'full')
        .then(res => res.should.equal(meme.list1 + meme.list2 + meme.list3));
      });
    });

    describe('none', () => {
      it('should return the correct help text', done => {
        const evt = {
          message: {
            channel: {}
          }
        };
        return help.memelist({}, evt)
        .then(res => res.should.equal(meme.all));
      });
    });
  });
});
