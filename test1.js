import cheerio from 'cheerio';
import Promise from 'bluebird';
import R from 'ramda';

const request = Promise.promisify(require('request'));

function processHero($, heros_el) {
  return heros_el.map((idx, el) => {
    el = $(el);
    const css_attributes = R.fromPairs(R.map(style => R.trim(style).split(':'), el.find('.bar').attr('style').split(';')))
    const name = el.find('.title').text();
    return {
      name,
      image_name: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      value: el.find('.description').text(),
      meta: {
        progress_bar_percent: el.attr('data-overwatch-progress-percent'),
        ...css_attributes
      }
    }
  }).get();
}

request('https://playoverwatch.com/en-gb/career/pc/us/Zalik-1146')
  .then(R.prop('body'))
  .then(cheerio.load)
  .then($ => ({
    name: $('.header-masthead').text(),
    games_won: $('.masthead-detail > span').text().replace(/[^0-9]/g, ''),
    level: $('.player-level > div').text(),
    averages: {
      eliminations: $('.card-heading').eq(0).text(),
      damage: $('.card-heading').eq(1).text(),
      deaths: $('.card-heading').eq(2).text(),
      final_blows: $('.card-heading').eq(3).text(),
      healing: $('.card-heading').eq(4).text(),
      objective_kills: $('.card-heading').eq(5).text(),
      objective_time: $('.card-heading').eq(6).text(),
      solo_kills: $('.card-heading').eq(7).text()
    },
    heroes: {
      time_played: processHero($, $('.progress-category').eq(0).children()),
      games_won: processHero($, $('.progress-category').eq(1).children()),
      win_precent: processHero($, $('.progress-category').eq(2).children()),
      eliminations_per_life: processHero($, $('.progress-category').eq(4).children()),
      kill_streak: processHero($, $('.progress-category').eq(5).children()),
      multikill: processHero($, $('.progress-category').eq(6).children()),
      objective_kills: processHero($, $('.progress-category').eq(7).children())
    }
  }))
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  })
