import { subCommands as helpText } from '../../help';

import { bans, best, counters, items, skills } from './championgg';
import { serverStatus, matchDetails } from './riot';


export default {
  lol: (client, evt, suffix, lang) => {
    const command = suffix.toLowerCase().split(' ')[0];

    if (command === 'ban') return bans();
    if (command === 'bans') return bans();
    if (command === 'best') return best(suffix, lang);
    if (command === 'build') return items(suffix, lang);
    if (command === 'builds') return items(suffix, lang);
    if (command === 'counter') return counters(suffix, lang);
    if (command === 'counters') return counters(suffix, lang);
    if (command === 'item') return items(suffix, lang);
    if (command === 'items') return items(suffix, lang);
    if (command === 'match') return matchDetails(client, evt, suffix, lang);
    if (command === 'skill') return skills(suffix, lang);
    if (command === 'skills') return skills(suffix, lang);
    if (command === 'server') return serverStatus(suffix, lang);
    if (command === 'server-status') return serverStatus(suffix, lang);
    if (command === 'servers') return serverStatus(suffix, lang);
    if (command === 'serverstatus') return serverStatus(suffix, lang);
    if (command === 'status') return serverStatus(suffix, lang);
    return helpText(client, evt, 'lol', lang);
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
        parameters: 'position'
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
