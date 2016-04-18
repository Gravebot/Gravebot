import Promise from 'bluebird';
import cheerio from 'cheerio';
import _request from 'request';
import R from 'ramda';

import { subCommands as helpText } from '../help';


const request = Promise.promisify(_request);

// Cyanide and Happiness
function cah() {
  return request('http://explosm.net/comics/random/')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => `http:${$('#main-comic').attr('src')}`);
}

// Saturday Morning Breakfast Cereal
function smbc() {
  return request('http://www.smbc-comics.com/')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('.random').first().attr('href'))
    .then(url => request(`http://www.smbc-comics.com/${url}`))
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => `http://www.smbc-comics.com/${$('#comic').attr('src')}`);
}

// Amazing Super Powers
function amazingSuperPowers() {
  return request('http://www.amazingsuperpowers.com/?randomcomic&nocache=1')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic-1').find('img').first().attr('src'));
}

// Awkward Zombie
function awkwardZombie() {
  function _makeRequest(url) {
    const options = {
      url: `http://www.awkwardzombie.com/${url}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
      }
    };

    return request(options)
      .then(R.prop('body'))
      .then(cheerio.load);
  }

  return _makeRequest('index.php?page=1')
    .then($ => {
      const table = $('#archive_table').find('tr');
      const rand = Math.floor(Math.random() * table.length);
      const url = table.eq(rand).find('a').first().attr('href');
      return _makeRequest(url);
    })
    .then($ => $('#comic').find('img').first().attr('src'));
}

// Chain Saw Suit
function chainsawsuit() {
  return request('http://chainsawsuit.com/random/?random&nocache=1')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic').find('img').first().attr('src'));
}

// Dog House Diaries
function dogHouseDiaries() {
  return request('http://thedoghousediaries.com/')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#randomlink').attr('href'))
    .then(url => request(url))
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#imgdiv').find('img').first().attr('src').replace('\n', ''))
    .then(url => `http://thedoghousediaries.com/${url}`);
}

// The Oatmeal
function theOatmeal() {
  return request('http://theoatmeal.com/feed/random')
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => $('#comic').find('img').first().attr('src'));
}

// xkcd
function xkcd() {
  const options = {
    url: 'https://c.xkcd.com/random/comic/',
    rejectUnauthorized: false,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
    }
  };

  return request(options)
    .then(R.prop('body'))
    .then(cheerio.load)
    .then($ => `https:${$('#comic').find('img').first().attr('src')}`);
}

function randomComic() {
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
  return commands[rand]();
}

function comics(client, evt, suffix, lang) {
  suffix = suffix.toLowerCase();
  if (suffix === 'random') return randomComic();

  // Cyanide and Happiness
  if (suffix === 'cah') return cah();
  if (suffix === 'cyanide') return cah();
  if (suffix === 'cyanide and happiness') return cah();

  // Saturday Morning Breakfast Cereal
  if (suffix === 'smbc') return smbc();
  if (suffix === 'saturday morning breakfast cereal') return smbc();

  // Amazing Super Powers
  if (suffix === 'asp') return amazingSuperPowers();
  if (suffix === 'amazing super powers') return amazingSuperPowers();

  // Awkward Zombie
  if (suffix === 'az') return awkwardZombie();
  if (suffix === 'awkward zombie') return awkwardZombie();

  // chainsawsuit
  if (suffix === 'css') return chainsawsuit();
  if (suffix === 'chainsawsuit') return chainsawsuit();
  if (suffix === 'chain saw suit') return chainsawsuit();

  // Dog House Diaries
  if (suffix === 'dhd') return dogHouseDiaries();
  if (suffix === 'doghousdiaries') return dogHouseDiaries();
  if (suffix === 'dog house diaries') return dogHouseDiaries();

  // The Oatmeal
  if (suffix === 'to') return theOatmeal();
  if (suffix.indexOf('oatmeal') > -1) return theOatmeal();

  // xkcd
  if (suffix === 'xkcd') return xkcd();

  return helpText(client, evt, 'comics', lang);
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
