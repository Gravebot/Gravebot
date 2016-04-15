import Promise from 'bluebird';
import cheerio from 'cheerio';
import _request from 'request';
import R from 'ramda';

import { subCommands as helpText } from '../help';
import sentry from '../../sentry';


const request = Promise.promisify(_request);

// Cyanide and Happiness
function cah(client, e) {
  request('http://explosm.net/comics/random/')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#main-comic').attr('src'))
    .then(url => e.message.channel.sendMessage(`http:${url}`))
    .catch(err => {
      sentry(err, 'comics', 'cah');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

// Saturday Morning Breakfast Cereal
function smbc(client, e) {
  request('http://www.smbc-comics.com/')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('.random').first().attr('href'))
    .then(url => request(`http://www.smbc-comics.com/${url}`))
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic').attr('src'))
    .then(url => e.message.channel.sendMessage(`http://www.smbc-comics.com/${url}`))
    .catch(err => {
      sentry(err, 'comics', 'smbc');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

// Amazing Super Powers
function amazingSuperPowers(client, e) {
  request('http://www.amazingsuperpowers.com/?randomcomic&nocache=1')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic-1').find('img').first().attr('src'))
    .then(url => e.message.channel.sendMessage(url))
    .catch(err => {
      sentry(err, 'comics', 'amazingSuperPowers');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

// Awkward Zombie
function awkwardZombie(client, e) {
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
    .then(url => e.message.channel.sendMessage(url))
    .catch(err => {
      sentry(err, 'comics', 'awkwardZombie');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

// Chain Saw Suit
function chainsawsuit(client, e) {
  request('http://chainsawsuit.com/random/?random&nocache=1')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic').find('img').first().attr('src'))
    .then(url => e.message.channel.sendMessage(url))
    .catch(err => {
      sentry(err, 'comics', 'chainsawsuit');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

// Dog House Diaries
function dogHouseDiaries(client, e) {
  request('http://thedoghousediaries.com/')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#randomlink').attr('href'))
    .then(url => request(url))
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#imgdiv').find('img').first().attr('src').replace('\n', ''))
    .then(url => e.message.channel.sendMessage(`http://thedoghousediaries.com/${url}`))
    .catch(err => {
      sentry(err, 'comics', 'dogHouseDiaries');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

// The Oatmeal
function theOatmeal(client, e) {
  request('http://theoatmeal.com/feed/random')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic').find('img').first().attr('src'))
    .then(url => e.message.channel.sendMessage(url))
    .catch(err => {
      sentry(err, 'comics', 'theOatmeal');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

// xkcd
function xkcd(client, e) {
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
    .then(url => e.message.channel.sendMessage(`https:${url}`))
    .catch(err => {
      sentry(err, 'comics', 'xkcd');
      e.message.channel.sendMessage(`Error: ${err.message}`);
    });
}

function randomComic(client, e) {
  // Add all commands here so a random one can be selected
  const commands = [
    cah,
    smbc,
    amazingSuperPowers,
    awkwardZombie,
    chainsawsuit,
    dogHouseDiaries,
    theOatmeal,
    xkcd
  ];
  const rand = Math.floor(Math.random() * commands.length);
  commands[rand](client, e);
}

function comics(client, e, suffix, lang) {
  suffix = suffix.toLowerCase();
  if (suffix === 'random') return randomComic(client, e);

  // Cyanide and Happiness
  if (suffix === 'cah') return cah(client, e);
  if (suffix === 'cyanide') return cah(client, e);
  if (suffix === 'cyanide and happiness') return cah(client, e);

  // Saturday Morning Breakfast Cereal
  if (suffix === 'smbc') return smbc(client, e);
  if (suffix === 'saturday morning breakfast cereal') return smbc(client, e);

  // Amazing Super Powers
  if (suffix === 'asp') return amazingSuperPowers(client, e);
  if (suffix === 'amazing super powers') return amazingSuperPowers(client, e);

  // Awkward Zombie
  if (suffix === 'az') return awkwardZombie(client, e);
  if (suffix === 'awkward zombie') return awkwardZombie(client, e);

  // chainsawsuit
  if (suffix === 'css') return chainsawsuit(client, e);
  if (suffix === 'chainsawsuit') return chainsawsuit(client, e);
  if (suffix === 'chain saw suit') return chainsawsuit(client, e);

  // Dog House Diaries
  if (suffix === 'dhd') return dogHouseDiaries(client, e);
  if (suffix === 'doghousdiaries') return dogHouseDiaries(client, e);
  if (suffix === 'dog house diaries') return dogHouseDiaries(client, e);

  // The Oatmeal
  if (suffix === 'to') return theOatmeal(client, e);
  if (suffix.indexOf('oatmeal') > -1) return theOatmeal(client, e);

  // xkcd
  if (suffix === 'xkcd') return xkcd(client, e);

  return e.message.channel.sendMessage(helpText(client, e, 'comics', lang));
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
