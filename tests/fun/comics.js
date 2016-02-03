import chai from 'chai';
import nock from 'nock';
import path from 'path';
import sinon from 'sinon';

import { loadFixtures } from '../_helpers';
import comics from '../../lib/fun/comics';


chai.should();
const FIXTURES = loadFixtures(path.join(__dirname, '../fixtures/comics'));

describe('comics', () => {
  describe('cyanide and happiness', () => {
    it('should return a cyanide and happiness comic', (done) => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://files.explosm.net/comics/Rob/condescending.png');
        done();
      }

      nock.cleanAll();
      nock('http://explosm.net')
        .get('/comics/random/')
        .reply(200, FIXTURES.cah);

      comics.comics({sendMessage}, {channel: 'test'}, 'cah');
    });
  });

  describe('saturday morning breakfast cereal', () => {
    it('should return a saturday morning breakfast cereal comic', (done) => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://www.smbc-comics.com/comics/20150110.png');
        done();
      }

      nock.cleanAll();
      nock('http://www.smbc-comics.com')
        .get('/')
        .reply(200, FIXTURES.smbc_1)
        .get('/index.php?id=3606')
        .reply(200, FIXTURES.smbc_2);

      comics.comics({sendMessage}, {channel: 'test'}, 'smbc');
    });
  });

  describe('amazing super powers', () => {
    it('should return a amazing super powers comic', (done) => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://www.amazingsuperpowers.com/comics/2014-01-02-Without-Sin.png');
        done();
      }

      nock.cleanAll();
      nock('http://www.amazingsuperpowers.com')
        .get('/?randomcomic&nocache=1')
        .reply(200, FIXTURES.asp);

      comics.comics({sendMessage}, {channel: 'test'}, 'asp');
    });
  });

  describe('awkward zombie', () => {
    it('should return a awkward zombie comic', (done) => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(Math, 'random', () => 0.3);

      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i49.photobucket.com/albums/f278/katietiedrich/comic182.png');

        sandbox.restore();
        done();
      }

      nock.cleanAll();
      nock('http://www.awkwardzombie.com')
        .get('/index.php?page=1')
        .reply(200, FIXTURES.az_1)
        .get('/index.php?page=0&comic=070113')
        .reply(200, FIXTURES.az_2);

      comics.comics({sendMessage}, {channel: 'test'}, 'az');
    });
  });

  describe('chainsawsuit', () => {
    it('should return a chainsawsuit comic', (done) => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://chainsawsuit.com/wp-content/uploads/2011/06/201004061.png');
        done();
      }

      nock.cleanAll();
      nock('http://chainsawsuit.com')
        .get('/random/?random&nocache=1')
        .reply(200, FIXTURES.css);

      comics.comics({sendMessage}, {channel: 'test'}, 'css');
    });
  });

  describe('dog house diaries', () => {
    it('should return a dog house diaries comic', (done) => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://thedoghousediaries.com/dhdcomics/2015-08-13.png');
        done();
      }

      nock.cleanAll();
      nock('http://thedoghousediaries.com')
        .get('/')
        .reply(200, FIXTURES.dgd_1)
        .get('/1406')
        .reply(200, FIXTURES.dgd_1);

      comics.comics({sendMessage}, {channel: 'test'}, 'dhd');
    });
  });

  describe('the oatmeal', () => {
    it('should return a oatmeal comic', (done) => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://s3.amazonaws.com/theoatmeal-img/comics/same_cloth/same_cloth.png');
        done();
      }

      nock.cleanAll();
      nock('http://theoatmeal.com')
        .get('/feed/random')
        .reply(200, FIXTURES.to);

      comics.comics({sendMessage}, {channel: 'test'}, 'to');
    });
  });

  describe('xkcd', () => {
    it('should return a xkcd comic', (done) => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('https://imgs.xkcd.com/comics/xkcd_phone_3.png');
        done();
      }

      nock.cleanAll();
      nock('https://c.xkcd.com')
        .get('/random/comic/')
        .reply(200, FIXTURES.xkcd);

      comics.comics({sendMessage}, {channel: 'test'}, 'xkcd');
    });
  });
});
