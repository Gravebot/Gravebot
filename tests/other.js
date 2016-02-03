import chai from 'chai';
import path from 'path';

import other from '../lib/other';


chai.should();

describe('other', () => {
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
      other.ayylmao({
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
      other.chillenmyb({sendMessage}, {channel: 'test'});
    });
  });

  describe('endall', () => {
    it('should return the correct imgur url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/SNmMCQV.png');
        done();
      }
      other.endall({sendMessage}, {channel: 'test'});
    });
  });

  describe('feelsgoodman', () => {
    it('should return the correct local file', done => {
      function sendFile(channel, res) {
        channel.should.equal('test');
        res.should.equal(path.join(__dirname, '../images/Feelsgoodman.png'));
        done();
      }
      other.feelsgoodman({sendFile}, {channel: 'test'});
    });
  });

  describe('jpeg', () => {
    it('should return the correct youtube url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('https://www.youtube.com/watch?v=QEzhxP-pdos');
        done();
      }
      other.jpeg({sendMessage}, {channel: 'test'});
    });
  });

  describe('kappa', () => {
    it('should return the correct local file', done => {
      function sendFile(channel, res) {
        channel.should.equal('test');
        res.should.equal(path.join(__dirname, '../images/Kappa.png'));
        done();
      }
      other.kappa({sendFile}, {channel: 'test'});
    });
  });

  describe('kappahd', () => {
    it('should return the correct local file', done => {
      function sendFile(channel, res) {
        channel.should.equal('test');
        res.should.equal(path.join(__dirname, '../images/Kappahd.png'));
        done();
      }
      other.kappahd({sendFile}, {channel: 'test'});
    });
  });

  describe('skeltal', () => {
    it('should return the correct imgur url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/ZX79Q4S.gif');
        done();
      }
      other.skeltal({sendMessage}, {channel: 'test'});
    });
  });

  describe('starwars4', () => {
    it('should return the correct imgur url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/l9VKWWF.gif');
        done();
      }
      other.starwars4({sendMessage}, {channel: 'test'});
    });
  });

  describe('starwars5', () => {
    it('should return the correct imgur url', done => {
      function sendMessage(channel, res) {
        channel.should.equal('test');
        res.should.equal('http://i.imgur.com/eCpwo6J.gif');
        done();
      }
      other.starwars5({sendMessage}, {channel: 'test'});
    });
  });
});
