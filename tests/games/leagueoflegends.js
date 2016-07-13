import chai from 'chai';
import nconf from 'nconf';
import nock from 'nock';
import path from 'path';

import lol from '../../src/commands/games/leagueoflegends';
import { loadFixtures } from '../_helpers';


chai.should();
const FIXTURES = loadFixtures(path.join(__dirname, '../fixtures/leagueoflegends/'));

describe('league of legends', () => {
  before(() => {
    nconf.set('CHAMPIONGG_KEY', 'api_key');
    nconf.set('RIOT_KEY', 'api_key');
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('counters', () => {
    it('should return counters for ekko mid', function() {
      this.timeout(7000);

      nock('http://api.champion.gg')
        .get('/champion/ekko/matchup?api_key=api_key')
        .reply(200, FIXTURES.counters);

      return lol.lol({}, {}, 'counters ekko mid')
        .then(res => {
          res.upload.length.should.be.at.least(70000);
          res.filename.should.equal('counters_ekko_Middle.png');
        });
    });
  });

  describe('items', () => {
    it('should return an image buffer larger than 70000', function() {
      this.timeout(7000);
      nock('http://api.champion.gg')
        .get('/champion/ekko/items/finished/mostWins?api_key=api_key')
        .reply(200, FIXTURES.items);

      return lol.lol({}, {}, 'items ekko mid')
        .then(res => {
          res.upload.length.should.be.at.least(70000);
          res.filename.should.equal('items_ekko_Middle.png');
        });
    });
  });

  describe('skills', () => {
    it('should return skills for ekko mid', () => {
      nock('http://api.champion.gg')
        .get('/champion/ekko/skills/mostWins?api_key=api_key')
        .reply(200, FIXTURES.skills);

      return lol.lol({}, {}, 'skills ekko mid')
        .then(res => {
          res.should.equal(`Okay! Here's the skill order for **Ekko Middle**.

**Skill Priority:** Q>E>W
**Full Order:** Q,E,Q,W,Q,R,Q,E,Q,E,R,E,E,W,W,R,W,W`);
        });
    });
  });

  describe('bans', () => {
    it('should return the top bans', () => {
      nock('http://api.champion.gg')
        .get('/stats/champs/mostBanned?api_key=api_key&limit=25&page=1')
        .reply(200, FIXTURES.bans);

      return lol.lol({}, {}, 'bans')
        .then(res => {
          res.should.equal(`You got it! Here's the top 10 most common bans:

*1st*. **Dr. Mundo**
*2nd*. **Jax**
*3rd*. **Tahm Kench**
*4th*. **Soraka**
*5th*. **Illaoi**
*6th*. **Brand**
*7th*. **Yasuo**
*8th*. **Fiora**
*9th*. **Rengar**
*10th*. **Kindred**`);
        });
    });
  });

  // TODO: Test for all lanes.
  describe('best', () => {
    it('should return the best champs for mid lane', () => {
      nock('http://api.champion.gg')
        .get('/stats/role/Middle/bestPerformance?api_key=api_key&limit=10&page=1')
        .reply(200, FIXTURES.best);

      return lol.lol({}, {}, 'best mid')
        .then(res => {
          res.should.equal(`Sick! Here's the top 10 **statistically** best for **Middle**:

*1st*. **Gangplank** with a 53.81% winrate.
*2nd*. **Lux** with a 54.35% winrate.
*3rd*. **Anivia** with a 51.94% winrate.
*4th*. **Zed** with a 51.7% winrate.
*5th*. **Brand** with a 52.97% winrate.
*6th*. **Ahri** with a 53.04% winrate.
*7th*. **Vel'Koz** with a 54.07% winrate.
*8th*. **Morgana** with a 54.72% winrate.
*9th*. **Talon** with a 53.41% winrate.
*10th*. **Malzahar** with a 52.58% winrate.`);
        });
    });
  });

  describe('match details', () => {
    it('should return match details for a specific player', () => {
      // Summoner Lookup
      nock('https://na.api.pvp.net')
        .get('/api/lol/na/v1.4/summoner/by-name/omervalentine?api_key=api_key')
        .reply(200, FIXTURES.match_details_1)
        .get('/observer-mode/rest/consumer/getSpectatorGameInfo/NA1/43260920?api_key=api_key')
        .reply(200, FIXTURES.match_details_2)
        .get(`/api/lol/na/v2.5/league/by-summoner/43260920,432609201/entry?api_key=api_key`)
        .reply(200, FIXTURES.match_details_3)
        .get('/api/lol/na/v1.3/stats/by-summoner/43260920/ranked?api_key=api_key')
        .times(9)
        .reply(200, FIXTURES.match_details_4)
        .get('/api/lol/na/v1.3/stats/by-summoner/432609201/ranked?api_key=api_key')
        .reply(200, FIXTURES.match_details_5);

      const evt = {message: {mentions: []}};
      return lol.lol({}, evt, 'match na omervalentine')
        .then(res => {
          res.should.equal(`Game on! You can find **omervalentine** on __Red__ side.

__Blue Side:__
    **OmerValentine1** - Gold V - **Zed**,  __0%__ winrate over __0 games__

__Red Side:__
    **OmerValentine** - Gold V - **Lucian**,  __50%__ winrate over __2 games__`);
        });
    });
  });
});
