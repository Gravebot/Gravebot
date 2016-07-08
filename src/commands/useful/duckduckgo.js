import Promise from 'bluebird';

import T from '../../translate';

const request = Promise.promisify(require('request'));


function ddg(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('ddg_usage', lang));

  let bang = suffix.split()[0];
  let query = suffix.split()[1];
  if (bang[0] !== '!') {
    bang = '';
    query = suffix.split();
  }

  const options = {
    method: 'GET',
    url: 'http://api.duckduckgo.com/',
    qs: {
      q: `${bang} ${query}`,
      format: 'json',
      pretty: '0',
      no_redirect: '1',
      no_html: '1',
      skip_disambig: '0',
      t: 'Gravebot-Discord'
    }
  };
  return request(options)
  .then(response => {
    console.log(response.body);
    if (!response.body.length) return Promise.resolve(`${T('ddg_error', lang)}: ${suffix}`);
    const res = JSON.parse(response.body);
    if (res.Redirect) return res.Redirect;
    return `${res.RelatedTopics[0].Text ? res.RelatedTopics[0].Text : ''}\n${res.RelatedTopics[1].Text ? res.RelatedTopics[1].Text : ''}\n${res.RelatedTopics[2].Text ? res.RelatedTopics[2].Text : ''}\n${res.AbstractURL}`;
  });
}
// evt.message.guild.afk_channel ? evt.message.guild.afk_channel.name : 'None'
export default {
  bang: ddg,
  d: ddg,
  ddg,
  duck: ddg,
  duckduckgo: ddg,
  s: ddg,
  search: ddg
};

export const help = {
  ddg: {parameters: ['bang (optional)', 'query']}
};
