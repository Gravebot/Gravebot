import { subCommands as helpText } from '../../help';

import { bans, best, counters, items, skills } from './championgg';
import { serverStatus, matchDetails } from './riot';


export default {
  lol: (bot, msg, suffix) => {
    const command = suffix.toLowerCase().split(' ')[0];

    if (command === 'ban') return bans(bot, msg);
    if (command === 'bans') return bans(bot, msg);
    if (command === 'best') return best(bot, msg, suffix);
    if (command === 'build') return items(bot, msg, suffix);
    if (command === 'builds') return items(bot, msg, suffix);
    if (command === 'counter') return counters(bot, msg, suffix);
    if (command === 'counters') return counters(bot, msg, suffix);
    if (command === 'item') return items(bot, msg, suffix);
    if (command === 'items') return items(bot, msg, suffix);
    if (command === 'match') return matchDetails(bot, msg, suffix);
    if (command === 'skill') return skills(bot, msg, suffix);
    if (command === 'skills') return skills(bot, msg, suffix);
    if (command === 'server') return serverStatus(bot, msg, suffix);
    if (command === 'server-status') return serverStatus(bot, msg, suffix);
    if (command === 'servers') return serverStatus(bot, msg, suffix);
    if (command === 'serverstatus') return serverStatus(bot, msg, suffix);
    if (command === 'status') return serverStatus(bot, msg, suffix);
    return helpText(bot, msg, 'lol');
  }
};

export const help = {
  lol: {
    category: 'games',
    header_text: 'lol_header_text',
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
