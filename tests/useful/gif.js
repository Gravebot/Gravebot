import chai from 'chai';
import nock from 'nock';
import path from 'path';
import sinon from 'sinon';

import gif from '../../lib/useful/gif';


let sandbox;
chai.should();
const res_fixture_giphy = require(path.join(__dirname, '../fixtures/giphy.json'));
const res_fixture_popkey = require(path.join(__dirname, '../fixtures/popkey.json'));

describe('gif', () => {
  describe('giphy', () => {
    it('should return a gif when querying "food"', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://media4.giphy.com/media/xTiTnKmRgF5KrpqRby/giphy.gif');
        done();
      }

      nock.cleanAll();
      nock('http://api.giphy.com')
        .get('/v1/gifs/random?api_key=dc6zaTOxFJmzC&rating=r&format=json&limit=1&tag=food')
        .reply(200, res_fixture_giphy);

      gif.giphy({sendMessage}, {channel: 'test'}, 'food');
    });
  });
  describe('popkey', () => {
    it('should return a gif when querying "food"', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('https://popkey-assets.s3.amazonaws.com/original-30ab9d03-a65b-4759-a953-143524c61765.GIF');
        done();
      }

      nock.cleanAll();
      nock('http://api.popkey.co')
        .get('v2/media/search?q=food')
        .reply(200, res_fixture_popkey);

      gif.popkey({sendMessage}, {channel: 'test'}, 'food');
    });
  });
  describe('gif', () => {
    before(() => {
      sandbox = sinon.sandbox.create();
      sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
    });

    after(() => sandbox.restore());

    it('should choose between giphy and popkey', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('https://popkey-assets.s3.amazonaws.com/original-30ab9d03-a65b-4759-a953-143524c61765.GIF');
        done();
      }

      nock.cleanAll();
      nock('http://api.popkey.co')
        .get('v2/media/search?q=food')
        .reply(200, res_fixture_popkey);

      gif.gif({sendMessage}, {channel: 'test'}, 'food');
    });
  });
});
