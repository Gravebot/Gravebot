import R from 'ramda';
import * as blizzard from './blizzard';
import { subCommands as helpText } from '../../help';


export default {
  ow: (client, evt, suffix, lang) => {
    let region;
    const suffix_split = suffix.split(' ');
    const player_name = R.last(suffix_split);
    suffix_split.pop();
    if (suffix_split.length && R.contains(R.last(suffix_split).toLowerCase(), ['na', 'eu', 'us', 'cn', 'kr'])) {
      region = R.last(suffix_split).toLowerCase();
      if (region === 'na') region = 'us';
      suffix_split.pop();
    }
    const command = suffix_split.join('').toLowerCase();

    if (R.contains(command, ['average', 'averages'])) return blizzard.averages(player_name, region);
    if (R.contains(command, ['timeplayed', 'mostplayed'])) return blizzard.timePlayed(player_name, region);
    if (command === 'gameswon') return blizzard.gamesWon(player_name, region);
    if (command === 'winpercent') return blizzard.winPercent(player_name, region);
    if (command === 'eliminations') return blizzard.eliminations(player_name, region);
    if (R.contains(command, ['eliminations', 'eliminationsperlife'])) return blizzard.eliminations(player_name, region);
    if (command === 'killstreak') return blizzard.killStreak(player_name, region);
    if (command === 'multikill') return blizzard.multikill(player_name, region);
    if (command === 'objectivekills') return blizzard.objectiveKills(player_name, region);
    return helpText(client, evt, 'ow', lang);
  }
};

export const help = {
  ow: {
    category: 'games',
    header_text: 'ow_header_text',
    static_texts: {
      ow_regions: '**us, eu, cn, kr**'
    },
    subcommands: [
      {
        name: 'averages',
        parameters: ['region', 'battletag']
      },
      {
        name: 'time played',
        parameters: ['region', 'battletag']
      },
      {
        name: 'games won',
        parameters: ['region', 'battletag']
      },
      {
        name: 'win percent',
        parameters: ['region', 'battletag']
      },
      {
        name: 'eliminations',
        parameters: ['region', 'battletag']
      },
      {
        name: 'kill streak',
        parameters: ['region', 'battletag']
      },
      {
        name: 'multikill',
        parameters: ['region', 'battletag']
      },
      {
        name: 'objective kills',
        parameters: ['region', 'battletag']
      }
    ]
  }
};
