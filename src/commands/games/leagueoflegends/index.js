import { subCommands as helpText } from '../../help';

import { bans, best, counters, items, skills } from './championgg';
import { serverStatus, matchDetails } from './riot';


export default {
  lol: (client, e, suffix, lang) => {
    const command = suffix.toLowerCase().split(' ')[0];

    if (command === 'ban') return bans(client, e);
    if (command === 'bans') return bans(client, e);
    if (command === 'best') return best(client, e, suffix);
    if (command === 'build') return items(client, e, suffix);
    if (command === 'builds') return items(client, e, suffix);
    if (command === 'counter') return counters(client, e, suffix);
    if (command === 'counters') return counters(client, e, suffix);
    if (command === 'item') return items(client, e, suffix);
    if (command === 'items') return items(client, e, suffix);
    if (command === 'match') return matchDetails(client, e, suffix);
    if (command === 'skill') return skills(client, e, suffix);
    if (command === 'skills') return skills(client, e, suffix);
    if (command === 'server') return serverStatus(client, e, suffix);
    if (command === 'server-status') return serverStatus(client, e, suffix);
    if (command === 'servers') return serverStatus(client, e, suffix);
    if (command === 'serverstatus') return serverStatus(client, e, suffix);
    if (command === 'status') return serverStatus(client, e, suffix);
    return helpText(client, e, 'lol', lang);
  }
};

export const help = {
  lol: {
    category: 'games',
    header_text: 'lol_header_text',
    static_texts: {
      lol_positions: '**Top, Mid, ADC, Jungle, Support**',
      lol_regions: '**br, eune, euw, kr, lan, las, na, oce, pbe, ru, and tr**'
    },
    subcommands: [
      {name: 'bans'},
      {
        name: 'best',
        parameters: ['position']
      },
      {
        name: 'counters',
        parameters: ['champ-name', 'position']
      },
      {
        name: 'items',
        parameters: ['champ-name', 'position']
      },
      {
        name: 'match',
        parameters: ['region', 'summoner-name']
      },
      {
        name: 'skills',
        parameters: ['champ-name', 'position']
      },
      {name: 'status'}
    ]
  }
};
