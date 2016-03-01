import Promise from 'bluebird';
import cheerio from 'cheerio';
import _request from 'request';
import R from 'ramda';

import { subCommands as helpText } from '../help';
import sentry from '../../sentry';


const request = Promise.promisify(_request);

// Cyanide and Happiness
function cah(bot, msg) {
  request('http://explosm.net/comics/random/')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#main-comic').attr('src'))
    .then(url => bot.sendMessage(msg.channel, `http:${url}`))
    .catch(err => {
      sentry(err, 'comics', 'cah');
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
      sentry(err, 'comics', 'smbc');
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
      sentry(err, 'comics', 'amazingSuperPowers');
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
      sentry(err, 'comics', 'awkwardZombie');
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
      sentry(err, 'comics', 'chainsawsuit');
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
      sentry(err, 'comics', 'dogHouseDiaries');
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
      sentry(err, 'comics', 'theOatmeal');
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
      sentry(err, 'comics', 'xkcd');
      bot.sendMessage(msg.channel, `Error: ${err.message}`);
    });
}

function randomComic(bot, msg) {
  // Add all commands here so a random one can be selected
  const commands = [
    cah,
    smbc,
    amazingSuperPowers,
    // awkwardZombie,
    chainsawsuit,
    // dogHouseDiaries,
    theOatmeal,
    xkcd
  ];
  const rand = Math.floor(Math.random() * commands.length);
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

  return bot.sendMessage(msg.channel, helpText(bot, msg, 'comics'));
}

export default {
  comic: comics,
  comics
};

export const help = {
  comics: {
    header_text: 'comics_header_text',
    subcommands: [
      {name: 'random'},
      {
        name: 'asp',
        secondary_name: 'amazing super powers'
      },
      {
        name: 'az',
        secondary_name: 'awkward zombie'
      },
      {
        name: 'cah',
        secondary_name: 'cyanide and happiness'
      },
      {
        name: 'css',
        secondary_name: 'chainsawsuit'
      },
      {
        name: 'dhd',
        secondary_name: 'dog house diaries'
      },
      {
        name: 'smbc',
        secondary_name: 'saturday morning breakfast cereal'
      },
      {
        name: 'to',
        secondary_name: 'the oatmeal'
      },
      {name: 'xkcd'}
    ]
  }
};
