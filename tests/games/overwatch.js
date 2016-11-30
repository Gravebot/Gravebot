import chai from 'chai';
import fs from 'fs';
import nock from 'nock';
import path from 'path';
import R from 'ramda';

import ow from '../../src/commands/games/overwatch';


chai.should();
const FIXTURE = fs.readFileSync(path.join(__dirname, '../fixtures/overwatch_profile.html'));
const battletag = 'Testname-1234';
const regions = ['eu', 'us', 'cn', 'kr'];

describe('overwatch', () => {
  beforeEach(() => {
    nock.cleanAll();
    const nocked = nock('https://playoverwatch.com');

    R.forEach(region => {
      if (region === 'us') {
        return nocked
          .head(`/en-gb/career/pc/${region}/${battletag}`)
          .reply(200);
      }
      nocked
        .head(`/en-gb/career/pc/${region}/${battletag}`)
        .reply(404);
    }, regions);

    return nocked
      .get(`/en-gb/career/pc/us/${battletag}`)
      .reply(200, FIXTURE);
  });

  it('averages should return a buffer and filename', () => {
    return ow.ow({}, {}, `averages ${battletag}`, 'en')
      .then(res => {
        res.upload.length.should.be.at.least(25000);
        res.filename.should.equal('gravebot_overwatch_averages.png');
      });
  });

  it('timePlayed should return a buffer and filename', () => {
    return ow.ow({}, {}, `time played ${battletag}`, 'en')
      .then(res => {
        res.upload.length.should.be.at.least(70000);
        res.filename.should.equal('gravebot_overwatch_timeplayed.png');
      });
  });

  it('gamesWon should return a buffer and filename', () => {
    return ow.ow({}, {}, `games won ${battletag}`, 'en')
      .then(res => {
        res.upload.length.should.be.at.least(70000);
        res.filename.should.equal('gravebot_overwatch_gameswon.png');
      });
  });

  // it('winPercent should return a buffer and filename', () => {
    // return ow.ow({}, {}, `win percent ${battletag}`, 'en')
      // .then(res => {
        // res.upload.length.should.be.at.least(70000);
        // res.filename.should.equal('gravebot_overwatch_winpercent.png');
      // });
  // });

  it('eliminations should return a buffer and filename', () => {
    return ow.ow({}, {}, `eliminations ${battletag}`, 'en')
      .then(res => {
        res.upload.length.should.be.at.least(70000);
        res.filename.should.equal('gravebot_overwatch_eliminations.png');
      });
  });


  it('weapon accuracy should return a buffer and filename', () => {
    return ow.ow({}, {}, `weapon accuracy ${battletag}`, 'en')
      .then(res => {
        res.upload.length.should.be.at.least(70000);
        res.filename.should.equal('gravebot_overwatch_accuracy.png');
      });
  });


  // it('killStreak should return a buffer and filename', () => {
  //   return ow.ow({}, {}, `kill streak ${battletag}`, 'en')
  //     .then(res => {
  //       res.upload.length.should.be.at.least(70000);
  //       res.filename.should.equal('gravebot_overwatch_killstreak.png');
  //     });
  // });

  it('multikill should return a buffer and filename', () => {
    return ow.ow({}, {}, `multikill ${battletag}`, 'en')
      .then(res => {
        res.upload.length.should.be.at.least(70000);
        res.filename.should.equal('gravebot_overwatch_multikill.png');
      });
  });

  it('objectiveKills should return a buffer and filename', () => {
    return ow.ow({}, {}, `objective kills ${battletag}`, 'en')
      .then(res => {
        res.upload.length.should.be.at.least(70000);
        res.filename.should.equal('gravebot_overwatch_objectivekills.png');
      });
  });
});
