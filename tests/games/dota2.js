import chai from 'chai';
import nock from 'nock';
import path from 'path';

import dota from '../../src/commands/games/dota2';
import { loadFixtures } from '../_helpers';


chai.should();
const FIXTURES = loadFixtures(path.join(__dirname, '../fixtures/dota2/'));

describe('dota2', () => {
  describe('best', () => {
    it('it should return a list of the top 10 best heroes', () => {
      nock.cleanAll();
      nock('http://www.dotabuff.com')
        .get('/heroes/lanes?lane=mid')
        .reply(200, FIXTURES.best);

      return dota.dota2({}, {}, 'best mid')
        .then(res => {
          res.should.equal(`Okay! Here's the top 10 **statistical** Heroes for **mid**:

*1st*. **Shadow Fiend**
    Presence: __90.74%__ | Winrate: __51.22%__ | KDA: __2.7691__ | GPM: __546.8119__ | XPM: __571.5334__
*2nd*. **Templar Assassin**
    Presence: __88.29%__ | Winrate: __50.63%__ | KDA: __2.9136__ | GPM: __524.0227__ | XPM: __576.9324__
*3rd*. **Storm Spirit**
    Presence: __85.77%__ | Winrate: __48.87%__ | KDA: __3.0408__ | GPM: __482.3736__ | XPM: __558.7176__
*4th*. **Tinker**
    Presence: __84.3%__ | Winrate: __46.21%__ | KDA: __2.9619__ | GPM: __467.0175__ | XPM: __525.773__
*5th*. **Invoker**
    Presence: __76.37%__ | Winrate: __50.62%__ | KDA: __3.1503__ | GPM: __465.6148__ | XPM: __515.4827__
*6th*. **Queen of Pain**
    Presence: __71.15%__ | Winrate: __46.43%__ | KDA: __3.3133__ | GPM: __470.747__ | XPM: __528.4107__
*7th*. **Outworld Devourer**
    Presence: __70.84%__ | Winrate: __48%__ | KDA: __2.5225__ | GPM: __451.1338__ | XPM: __502.5271__
*8th*. **Puck**
    Presence: __64.24%__ | Winrate: __44.36%__ | KDA: __2.9098__ | GPM: __417.1285__ | XPM: __497.0132__
*9th*. **Death Prophet**
    Presence: __62.36%__ | Winrate: __49.15%__ | KDA: __2.5247__ | GPM: __452.8678__ | XPM: __514.715__
*10th*. **Zeus**
    Presence: __61.04%__ | Winrate: __56.12%__ | KDA: __4.1543__ | GPM: __433.3088__ | XPM: __512.4047__`);
        });
    });
  });

  describe('build', () => {
    it('it should return the most popular build for anti-mage', () => {
      nock.cleanAll();
      nock('http://www.dotabuff.com')
        .get('/heroes/anti-mage/builds')
        .reply(200, FIXTURES.build);

      return dota.dota2({}, {}, 'build anti mage')
        .then(res => {
          res.should.equal(`You got it! Here's most popular build priorities for **Anti Mage**.
R > Q > W > E`);
        });
    });
  });

  describe('counters', () => {
    it('it should counters for anti-mage', () => {
      nock.cleanAll();
      nock('http://www.dotabuff.com')
        .get('/heroes/anti-mage/matchups')
        .reply(200, FIXTURES.counters);

      return dota.dota2({}, {}, 'counters anti mage')
        .then(res => {
          res.should.equal(`Sure! Here's the top 10 **statistical** counters for **Anti Mage** this month:

*1st*. **Wraith King** - 56.14% win rate over 590,941 matches.
*2nd*. **Zeus** - 55.4% win rate over 482,486 matches.
*3rd*. **Medusa** - 54.76% win rate over 267,265 matches.
*4th*. **Spectre** - 60.04% win rate over 306,314 matches.
*5th*. **Abaddon** - 59.6% win rate over 171,619 matches.
*6th*. **Clockwerk** - 48.3% win rate over 164,718 matches.
*7th*. **Ancient Apparition** - 49.67% win rate over 196,195 matches.
*8th*. **Slark** - 50.93% win rate over 443,573 matches.
*9th*. **Undying** - 55.01% win rate over 190,340 matches.
*10th*. **Phoenix** - 53.06% win rate over 104,058 matches.`);
        });
    });
  });

  describe('impact', () => {
    it('it should return the highest impacting heroes', () => {
      nock.cleanAll();
      nock('http://www.dotabuff.com')
        .get('/heroes/impact')
        .reply(200, FIXTURES.impact);

      return dota.dota2({}, {}, 'impact')
        .then(res => {
          res.should.equal(`Alright! Here's the top 10 Heroes with the biggest impact this month:

*1st*. **Spectre**
    KDA: __3.7913__ | Kills: __9.4035__ | Deaths: __6.9009__ | Assists: __16.76__
*2nd*. **Zeus**
    KDA: __3.5734__ | Kills: __9.9872__ | Deaths: __7.7636__ | Assists: __17.756__
*3rd*. **Necrophos**
    KDA: __3.1631__ | Kills: __9.2428__ | Deaths: __7.9451__ | Assists: __15.8888__
*4th*. **Medusa**
    KDA: __3.0695__ | Kills: __6.1923__ | Deaths: __5.7206__ | Assists: __11.3671__
*5th*. **Weaver**
    KDA: __3.0651__ | Kills: __9.7294__ | Deaths: __6.8751__ | Assists: __11.3443__
*6th*. **Invoker**
    KDA: __3.0193__ | Kills: __9.4518__ | Deaths: __7.268__ | Assists: __12.4928__
*7th*. **Wraith King**
    KDA: __2.9818__ | Kills: __7.5578__ | Deaths: __6.3821__ | Assists: __11.4725__
*8th*. **Abaddon**
    KDA: __2.8309__ | Kills: __5.9488__ | Deaths: __6.6633__ | Assists: __12.9143__
*9th*. **Riki**
    KDA: __2.7901__ | Kills: __10.5562__ | Deaths: __7.5115__ | Assists: __10.4022__
*10th*. **Viper**
    KDA: __2.7874__ | Kills: __10.2064__ | Deaths: __7.8425__ | Assists: __11.6541__`);
        });
    });
  });

  describe('items', () => {
    it('it should return the most used items for anti-mage', () => {
      nock.cleanAll();
      nock('http://www.dotabuff.com')
        .get('/heroes/anti-mage/items')
        .reply(200, FIXTURES.items);

      return dota.dota2({}, {}, 'items anti mage')
        .then(res => {
          res.should.equal(`Alright! Here's the top 10 **most used** items for **Anti Mage** this month:

*1st*. **Battle Fury** with 49.21% winrate over 4,875,904 matches
*2nd*. **Power Treads** with 43.9% winrate over 3,963,102 matches
*3rd*. **Manta Style** with 60.2% winrate over 3,691,084 matches
*4th*. **Vladmir's Offering** with 54.57% winrate over 2,195,412 matches
*5th*. **Abyssal Blade** with 76.77% winrate over 1,386,943 matches
*6th*. **Skull Basher** with 52.92% winrate over 1,295,968 matches
*7th*. **Town Portal Scroll** with 29.31% winrate over 1,256,926 matches
*8th*. **Heart of Tarrasque** with 71.67% winrate over 1,159,192 matches
*9th*. **Boots of Travel** with 68.93% winrate over 844,483 matches
*10th*. **Butterfly** with 79.96% winrate over 826,125 matches`);
        });
    });
  });
});
