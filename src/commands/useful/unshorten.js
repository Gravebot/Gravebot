import T from '../../translate';

const uu = require('url-unshort')({nesting: 3});


function unshorten(client, e, suffix, lang) {
  if (!suffix) {
    e.message.channel.sendMessage(T('unshorten_usage', lang));
    return;
  }

  uu.expand(suffix, (err, url) => {
    if (err) throw err;
    if (url) {
      e.message.channel.sendMessage(`Original url is:\n${url}`);
    } else {
      e.message.channel.sendMessage('This url can\'t be expanded.');
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
