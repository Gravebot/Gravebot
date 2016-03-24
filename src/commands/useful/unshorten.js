import T from '../../translate';

const uu = require('url-unshort')({nesting: 3});


function unshorten(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, T('unshorten_usage', msg.author.lang));
    return;
  }

  uu.expand(suffix, (err, url) => {
    if (err) throw err;
    if (url) {
      bot.sendMessage(msg.channel, `Original url is:\n${url}`);
    } else {
      bot.sendMessage(msg.channel, 'This url can\'t be expanded.');
    }
  });
}

export default {
  expand: unshorten,
  unshort: unshorten,
  unshorten
};

export const help = {
  unshorten: {parameters: 'url'}
};
