import chai from 'chai';
import path from 'path';

import customMemes from '../lib/custom_memes';

chai.should();

describe('custom_memes', () => {
  describe('ayylmao', () => {
    it('should return the correct imgur url and local file', done => {
      let completed = 0;

      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/m7NaGVx.gif');

        completed++;
        if (completed === 2) return done();
      }

      function sendFile(channel, res) {
        channel.should.equal('test');
        res.should.equal(path.join(__dirname, '../images/Ayylmao.png'));

        completed++;
        if (completed === 2) return done();
      }
      customMemes.ayylmao({
        sendMessage,
        sendFile
      }, {channel: 'test'});
    });
  });

  describe('chillenmyb', () => {
    it('should return the correct imgur url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/Qh75Dsi.jpg');
        done();
      }
      customMemes.chillenmyb({sendMessage}, {channel: 'test'});
    });
  });

  describe('endall', () => {
    it('should return the correct imgur url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/SNmMCQV.png');
        done();
      }
      customMemes.endall({sendMessage}, {channel: 'test'});
    });
  });

  describe('feelsgoodman', () => {
    it('should return the correct local file', done => {
      function sendFile(channel, res) {
        channel.should.equal('test');
        res.should.equal(path.join(__dirname, '../images/Feelsgoodman.png'));
        done();
      }
      customMemes.feelsgoodman({sendFile}, {channel: 'test'});
    });
  });

  describe('jpeg', () => {
    it('should return the correct youtube url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('https://www.youtube.com/watch?v=QEzhxP-pdos');
        done();
      }
      customMemes.jpeg({sendMessage}, {channel: 'test'});
    });
  });

  describe('kappa', () => {
    it('should return the correct local file', done => {
      function sendFile(channel, res) {
        channel.should.equal('test');
        res.should.equal(path.join(__dirname, '../images/Kappa.png'));
        done();
      }
      customMemes.kappa({sendFile}, {channel: 'test'});
    });
  });

  describe('kappahd', () => {
    it('should return the correct local file', done => {
      function sendFile(channel, res) {
        channel.should.equal('test');
        res.should.equal(path.join(__dirname, '../images/Kappahd.png'));
        done();
      }
      customMemes.kappahd({sendFile}, {channel: 'test'});
    });
  });

  describe('skeltal', () => {
    it('should return the correct imgur url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/ZX79Q4S.gif');
        done();
      }
      customMemes.skeltal({sendMessage}, {channel: 'test'});
    });
  });

  describe('starwars4', () => {
    it('should return the correct imgur url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/l9VKWWF.gif');
        done();
      }
      customMemes.starwars4({sendMessage}, {channel: 'test'});
    });
  });

  describe('starwars5', () => {
    it('should return the correct imgur url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/eCpwo6J.gif');
        done();
      }
      customMemes.starwars5({sendMessage}, {channel: 'test'});
    });
  });
});
