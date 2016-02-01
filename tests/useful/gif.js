import chai from 'chai';
import nock from 'nock';
import path from 'path';

import gif from '../../lib/useful/gif';


chai.should();
const res_fixture = require(path.join(__dirname, '../fixtures/giphy.json'));

describe('giphy', () => {
  it('should return a gif when querying "food"', done => {
    function sendMessage(channel, res) {
      channel.should.equal('test');
      res.should.equal('http://media.giphy.com/media/d2Z2xGvRyOJr31TO/giphy.gif');
      done();
    }

    nock.cleanAll();
    nock('http://api.giphy.com')
      .get('/v1/gifs/search?api_key=dc6zaTOxFJmzC&rating=r&format=json&limit=1&q=food')
      .reply(200, res_fixture);

    gif.giphy({sendMessage}, {channel: 'test'}, 'food');
  });
});
