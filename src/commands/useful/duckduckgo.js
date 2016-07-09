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
    const res = JSON.parse(response.body);
    let text = '';
    console.log(res);
    if (res.Redirect) {
      text += res.Redirect;
    } else if (res.Heading || res.Answer) {
      if (res.Answer) text += `${res.Answer}\n\n`;
      if (res.Definition) text += `${res.Definition}\n<${res.DefinitionURL}>\n\n`;
      if (res.AbstractText) text += `${res.AbstractText}\n\n`;
      if (res.Results[0]) text += `${res.Results[0].Text} - <${res.Results[0].FirstURL}>\n\n`;
      if (res.RelatedTopics[0]) {
        if (res.RelatedTopics[0].Text) {
          text += res.RelatedTopics[0].Text;
        } else {
          text += res.RelatedTopics[0].Topics[0].Text;
        }
      }
      if (res.RelatedTopics[1]) {
        if (res.RelatedTopics[1].Text) {
          text += `\n${res.RelatedTopics[1].Text}`;
        } else {
          text += `\n${res.RelatedTopics[1].Topics[0].Text}`;
        }
      }
      if (res.RelatedTopics[2]) {
        if (res.RelatedTopics[2].Text) {
          text += `\n${res.RelatedTopics[2].Text}`;
        } else {
          text += `\n${res.RelatedTopics[2].Topics[0].Text}`;
        }
      }
      if (res.RelatedTopics[3]) {
        if (res.RelatedTopics[3].Text) {
          text += `\n${res.RelatedTopics[3].Text}`;
        } else {
          text += `\n${res.RelatedTopics[3].Topics[0].Text}`;
        }
      }
      if (res.RelatedTopics[4]) {
        if (res.RelatedTopics[4].Text) {
          text += `\n${res.RelatedTopics[4].Text}`;
        } else {
          text += `\n${res.RelatedTopics[4].Topics[0].Text}`;
        }
      }
      if (res.AbstractURL) text += `\n<${res.AbstractURL}>`;
      if (res.Image) text += `\n${res.Image}`;
    } else {
      text += `${T('ddg_error', lang)}: ${suffix}`;
    }
    return text;
  });
}

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
