import chai from 'chai';
import path from 'path';

import other from '../src/commands/other';


chai.should();

describe('other', () => {
  describe('ayylmao', () => {
    it('should return the correct imgur url and local file', () => {
      return other.ayylmao()
        .then(res => {
          res.should.eql([
            'http://i.imgur.com/m7NaGVx.gif',
            {upload: path.join(__dirname, '../images/Ayylmao.png')}
          ]);
        });
    });
  });

  describe('chillinmyb', () => {
    it('should return the correct imgur url', () => {
      return other.chillinmyb()
        .then(res => res.should.equal('http://i.imgur.com/Qh75Dsi.jpg'));
    });
  });

  describe('endall', () => {
    it('should return the correct imgur url', () => {
      return other.endall()
        .then(res => res.should.equal('http://i.imgur.com/SNmMCQV.png'));
    });
  });

  describe('feelsbadman', () => {
    it('should return the correct local file', () => {
      return other.feelsbadman()
        .then(res => res.upload.should.equal(path.join(__dirname, '../images/Feelsbadman.png')));
    });
  });

  describe('feelsgoodman', () => {
    it('should return the correct local file', () => {
      return other.feelsgoodman()
        .then(res => res.upload.should.equal(path.join(__dirname, '../images/Feelsgoodman.png')));
    });
  });

  describe('jpeg', () => {
    it('should return the correct youtube url', () => {
      return other.jpeg()
        .then(res => res.should.equal('https://www.youtube.com/watch?v=QEzhxP-pdos'));
    });
  });

  describe('kappa', () => {
    it('should return the correct local file', () => {
      return other.kappa()
        .then(res => res.upload.should.equal(path.join(__dirname, '../images/Kappa.png')));
    });
  });

  describe('kappahd', () => {
    it('should return the correct local file', () => {
      return other.kappahd()
        .then(res => res.upload.should.equal(path.join(__dirname, '../images/Kappahd.png')));
    });
  });

  describe('skeltal', () => {
    it('should return the correct imgur url', () => {
      return other.skeltal()
        .then(res => res.should.equal('http://i.imgur.com/ZX79Q4S.gif'));
    });
  });

  describe('starwars4', () => {
    it('should return the correct imgur url', () => {
      return other.starwars4()
        .then(res => res.should.equal('http://i.imgur.com/l9VKWWF.gif'));
    });
  });

  describe('starwars5', () => {
    it('should return the correct imgur url', () => {
      return other.starwars5()
        .then(res => res.should.equal('http://i.imgur.com/eCpwo6J.gif'));
    });
  });
});
