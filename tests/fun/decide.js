import chai from 'chai';

import decide from '../lib/fun/decide';


chai.should();

describe('decide', () => {
  it('should pick hotdogs', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('I would choose **hotdogs**');
      done();
    }

    decide.decide({sendMessage}, {channel: 'test', author: 'author'}, 'hotdogs or burgers?');
  });
});
