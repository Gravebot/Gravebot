import Promise from 'bluebird';

import { subCommands as helpText } from '../help';


function monster(client, evt, suffix) {
  if (suffix) return Promise.resolve(`https://robohash.org/${suffix}.png?set=set2`);
  return Promise.resolve(`https://robohash.org/${evt.message.author.id}.png?set=set2`);
}

function robot(client, evt, suffix) {
  if (suffix) return Promise.resolve(`https://robohash.org/${suffix}.png?bgset=bg${Math.floor(Math.random() * 3) + 1}`);
  return Promise.resolve(`https://robohash.org/${evt.message.author.id}.png?bgset=bg${Math.floor(Math.random() * 3) + 1}`);
}

function robothead(client, evt, suffix) {
  if (suffix) return Promise.resolve(`https://robohash.org/${suffix}.png?set=set3`);
  return Promise.resolve(`https://robohash.org/${evt.message.author.id}.png?set=set3`);
}

function robohash(client, evt, suffix, lang) {
  return helpText(client, evt, 'robohash', lang);
}

export default {
  monster,
  monsters: monster,
  robohash,
  robot,
  robothead,
  robots: robot
};

export const help = {
  robohash: {
    prefix: false,
    header_text: 'robohash_header_text',
    subcommands: [
      {name: 'monster'},
      {name: 'robot'},
      {name: 'robothead'}
    ]
  }
};
