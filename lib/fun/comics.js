import Promise from 'bluebird';
import cheerio from 'cheerio';
import _request from 'request';
import R from 'ramda';

import sentry from '../config/sentry';


const request = Promise.promisify(_request);

const help_text = `Get random web comic strips

**\`!comic random\`**
    Returns a random comic from any of the artists
**\`!comic asp\`** or **\`!comic amazing super powers\`**
    Returns a Amazing Super Powers comic
**\`!comic az\`** or **\`!comic awkward zombie\`**
    Returns a Awkward Zombie comic
**\`!comic cah\`** or **\`!comic cyanide and happiness\`**
    Returns a Cyanide and Happimess comic
**\`!comic css\`** or **\`!comic chainsawsuit\`**
    Returns a chainsawsuit comic
**\`!comic dhd\`** or **\`!comic dog house diaries\`**
    Returns a Dog House Diaries comic
**\`!comic smbc\`** or ** \`!comic saturday morning breakfast cereal\`**
    Returns a Saturday Morning Breakfast Cereal comic
**\`!comic to\`** or **\`!comic the oatmeal\`**
    Returns a The Oatmeal comic
**\`!comic xkcd\`**
    Returns a xkcd comic`;

// Cyanide and Happiness
function cah(bot, msg) {
  request('http://explosm.net/comics/random/')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#main-comic').attr('src'))
    .then(url => bot.sendMessage(msg.channel, `http:${url}`))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

// Saturday Morning Breakfast Cereal
function smbc(bot, msg) {
  request('http://www.smbc-comics.com/')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('.random').first().attr('href'))
    .then(url => request(`http://www.smbc-comics.com/${url}`))
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic').attr('src'))
    .then(url => bot.sendMessage(msg.channel, `http://www.smbc-comics.com/${url}`))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

// Amazing Super Powers
function amazingSuperPowers(bot, msg) {
  request('http://www.amazingsuperpowers.com/?randomcomic&nocache=1')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic-1').find('img').first().attr('src'))
    .then(url => bot.sendMessage(msg.channel, url))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

// Awkward Zombie
function awkwardZombie(bot, msg) {
  function _makeRequest(url) {
    let options = {
      url: `http://www.awkwardzombie.com/${url}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
      }
    };

    return request(options)
      .then(R.prop('body'))
      .then(cheerio.load);
  }

  _makeRequest('index.php?page=1')
    .then($ => {
      let table = $('#archive_table').find('tr');
      let rand = Math.floor(Math.random() * table.length);
      let url = table.eq(rand).find('a').first().attr('href');
      return _makeRequest(url);
    })
    .then($ => $('#comic').find('img').first().attr('src'))
    .then(url => bot.sendMessage(msg.channel, url))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

// Chain Saw Suit
function chainsawsuit(bot, msg) {
  request('http://chainsawsuit.com/random/?random&nocache=1')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic').find('img').first().attr('src'))
    .then(url => bot.sendMessage(msg.channel, url))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

// Dog House Diaries
function dogHouseDiaries(bot, msg) {
  request('http://thedoghousediaries.com/')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#randomlink').attr('href'))
    .then(url => request(url))
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#imgdiv').find('img').first().attr('src').replace('\n', ''))
    .then(url => bot.sendMessage(msg.channel, `http://thedoghousediaries.com/${url}`))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

// The Oatmeal
function theOatmeal(bot, msg) {
  request('http://theoatmeal.com/feed/random')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic').find('img').first().attr('src'))
    .then(url => bot.sendMessage(msg.channel, url))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

// xkcd
function xkcd(bot, msg) {
  let options = {
    url: 'https://c.xkcd.com/random/comic/',
    rejectUnauthorized: false,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
    }
  };

  request(options)
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic').find('img').first().attr('src'))
    .then(url => bot.sendMessage(msg.channel, `https:${url}`))
    .catch(err => {
      sentry.captureError(err);
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function randomComic(bot, msg) {
  // Add all commands here so a random one can be selected
  let commands = [
    cah,
    smbc,
    amazingSuperPowers,
    awkwardZombie,
    chainsawsuit,
    dogHouseDiaries,
    theOatmeal,
    xkcd
  ];
  let rand = Math.floor(Math.random() * commands.length);
  commands[rand](bot, msg);
}

function comics(bot, msg, suffix) {
  suffix = suffix.toLowerCase();
  if (suffix === 'random') return randomComic(bot, msg);

  // Cyanide and Happiness
  if (suffix === 'cah') return cah(bot, msg);
  if (suffix === 'cyanide') return cah(bot, msg);
  if (suffix === 'cyanide and happiness') return cah(bot, msg);

  // Saturday Morning Breakfast Cereal
  if (suffix === 'smbc') return smbc(bot, msg);
  if (suffix === 'saturday morning breakfast cereal') return smbc(bot, msg);

  // Amazing Super Powers
  if (suffix === 'asp') return amazingSuperPowers(bot, msg);
  if (suffix === 'amazing super powers') return amazingSuperPowers(bot, msg);

  // Awkward Zombie
  if (suffix === 'az') return awkwardZombie(bot, msg);
  if (suffix === 'awkward zombie') return awkwardZombie(bot, msg);

  // chainsawsuit
  if (suffix === 'css') return chainsawsuit(bot, msg);
  if (suffix === 'chainsawsuit') return chainsawsuit(bot, msg);
  if (suffix === 'chain saw suit') return chainsawsuit(bot, msg);

  // Dog House Diaries
  if (suffix === 'dhd') return dogHouseDiaries(bot, msg);
  if (suffix === 'doghousdiaries') return dogHouseDiaries(bot, msg);
  if (suffix === 'dog house diaries') return dogHouseDiaries(bot, msg);

  // The Oatmeal
  if (suffix === 'to') return theOatmeal(bot, msg);
  if (suffix.indexOf('oatmeal') > -1) return theOatmeal(bot, msg);

  // xkcd
  if (suffix === 'xkcd') return xkcd(bot, msg);

  return bot.sendMessage(msg.channel, help_text);
}

export default {
  comic: comics,
  comics
};
