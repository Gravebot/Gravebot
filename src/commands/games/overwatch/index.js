import R from 'ramda';
import * as blizzard from './blizzard';
import { subCommands as helpText } from '../../help';


export default {
  ow: (client, evt, suffix, lang) => {
    const suffix_split = suffix.split(' ');
    const player_name = R.last(suffix_split);
    suffix_split.pop();
    const command = suffix_split.join('').toLowerCase();

    if (R.contains(command, ['average', 'averages'])) return blizzard.averages(player_name);
    if (R.contains(command, ['timeplayed', 'mostplayed'])) return blizzard.timePlayed(player_name);
    if (command === 'gameswon') return blizzard.gamesWon(player_name);
    if (command === 'winpercent') return blizzard.winPercent(player_name);
    if (command === 'eliminations') return blizzard.eliminations(player_name);
    if (R.contains(command, ['eliminations', 'eliminationsperlife'])) return blizzard.eliminations(player_name);
    if (command === 'killstreak') return blizzard.killStreak(player_name);
    if (command === 'multikill') return blizzard.multikill(player_name);
    if (command === 'objectivekills') return blizzard.objectiveKills(player_name);
    return helpText(client, evt, 'ow', lang);
  }
};

export const help = {
  ow: {
    category: 'games',
    header_text: 'ow_header_text',
    subcommands: [
      {
        name: 'time played',
        parameters: ['battletag']
      },
      {
        name: 'games won',
        parameters: ['battletag']
      },
      {
        name: 'win percent',
        parameters: ['battletag']
      },
      {
        name: 'eliminations',
        parameters: ['battletag']
      },
      {
        name: 'kill streak',
        parameters: ['battletag']
      },
      {
        name: 'multikill',
        parameters: ['battletag']
      },
      {
        name: 'objective kills',
        parameters: ['battletag']
      }
    ]
  }
};
