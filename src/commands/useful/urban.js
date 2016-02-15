import urbanQuery from 'urban';

import T from '../../translate';


function urban(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, T('urban_usage', msg.author.lang));
    return;
  }
  urbanQuery(suffix).first((json) => {
    if (json) {
      const definition = `${json.word}: ${json.definition}
:arrow_up: ${json.thumbs_up}   :arrow_down: ${json.thumbs_down}

Example: ${json.example}`;
      bot.sendMessage(msg.channel, definition);
    } else {
      bot.sendMessage(msg.channel, `${T('urban_error', msg.author.lang)}: ${suffix}`);
    }
  });
}

export default {
  ud: urban,
  urban
};

export const help = {
  urban: {parameters: ['search terms']}
};
