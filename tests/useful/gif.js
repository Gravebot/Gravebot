import chai from 'chai';
import nconf from 'nconf';
import nock from 'nock';
import path from 'path';
import sinon from 'sinon';

import gif from '../../src/commands/useful/gif';


let sandbox;
chai.should();
const res_fixture_giphy = require(path.join(__dirname, '../fixtures/giphy.json'));
const res_fixture_popkey = require(path.join(__dirname, '../fixtures/popkey.json'));

describe('gif', () => {
  before(() => {
    nconf.set('POPKEY_KEY', '123');
  });

  describe('giphy', () => {
    it('should return a gif when querying "food"', () => {
      nock.cleanAll();
      nock('http://api.giphy.com')
        .get('/v1/gifs/random?tag=food&api_key=dc6zaTOxFJmzC&rating=r&format=json&limit=1')
        .reply(200, res_fixture_giphy);

      return gif.giphy({}, {}, 'food')
        .then(res => res.should.equal('http://media4.giphy.com/media/xTiTnKmRgF5KrpqRby/giphy.gif'));
    });
  });

  describe('popkey', () => {
    it('should return a gif when querying "food"', () => {
      nock.cleanAll();
      nock('http://api.popkey.co')
        .get('/v2/media/search?q=food')
        .reply(200, res_fixture_popkey);

      return gif.popkey({}, {}, 'food')
        .then(res => res.should.equal('https://popkey-assets.s3.amazonaws.com/original-30ab9d03-a65b-4759-a953-143524c61765.GIF'));
    });
  });

  describe('gif', () => {
    before(() => {
      sandbox = sinon.sandbox.create();
      sandbox.stub(Math, 'random', () => 0.234342344890234089234089);
    });

    after(() => sandbox.restore());

    it('should choose between giphy and popkey', () => {
      nock.cleanAll();
      nock('http://api.popkey.co')
        .get('/v2/media/search?q=food')
        .reply(200, res_fixture_popkey);

      return gif.gif({}, {}, 'food')
        .then(res => res.should.equal('https://popkey-assets.s3.amazonaws.com/original-30ab9d03-a65b-4759-a953-143524c61765.GIF'));
    });
  });
});
