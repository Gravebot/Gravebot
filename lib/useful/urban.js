import urbanQuery from 'urban';


function urban(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, 'Usage: **`!urban`** `search terms`');
    return;
  }
  urbanQuery(suffix).first((json) => {
    if (json) {
      let definition = `${json.word}: ${json.definition}
:arrow_up: ${json.thumbs_up}   :arrow_down: ${json.thumbs_down}

Example: ${json.example}`;
      bot.sendMessage(msg.channel, definition);
    } else {
      bot.sendMessage(msg.channel, `I couldn't find a definition for: ${suffix}`);
    }
  });
}

export default {
  ud: urban,
  urban
};
