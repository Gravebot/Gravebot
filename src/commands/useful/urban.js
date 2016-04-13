import urbanQuery from 'urban';

import T from '../../translate';


function urban(client, e, suffix, lang) {
  if (!suffix) {
    e.message.channel.sendMessage(T('urban_usage', lang));
    return;
  }
  urbanQuery(suffix).first((json) => {
    if (json) {
      const definition = `${json.word}: ${json.definition}
:arrow_up: ${json.thumbs_up}   :arrow_down: ${json.thumbs_down}

Example: ${json.example}`;
      e.message.channel.sendMessage(definition);
    } else {
      e.message.channel.sendMessage(`${T('urban_error', lang)}: ${suffix}`);
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
