import Promise from 'bluebird';

import T from '../../translate';

const request = Promise.promisify(require('request'));


function ddg(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('ddg_usage', lang));

  const options = {
    method: 'GET',
    url: 'http://api.duckduckgo.com/',
    json: true,
    qs: {
      q: `${suffix}`,
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
    let text = '';

    if (response.body.Redirect) {
      text += response.body.Redirect;
    } else if (response.body.Heading || response.body.Answer) {
      if (response.body.Answer) text += `${response.body.Answer}\n\n`;
      if (response.body.Definition) text += `${response.body.Definition}\n<${response.body.DefinitionURL}>\n\n`;
      if (response.body.AbstractText) text += `${response.body.AbstractText}\n\n`;
      if (response.body.Results[0]) text += `${response.body.Results[0].Text} - <${response.body.Results[0].FirstURL}>\n\n`;
      if (response.body.RelatedTopics[0]) {
        if (response.body.RelatedTopics[0].Text) {
          text += response.body.RelatedTopics[0].Text;
        } else {
          text += response.body.RelatedTopics[0].Topics[0].Text;
        }
      }
      if (response.body.RelatedTopics[1]) {
        if (response.body.RelatedTopics[1].Text) {
          text += `\n${response.body.RelatedTopics[1].Text}`;
        } else {
          text += `\n${response.body.RelatedTopics[1].Topics[0].Text}`;
        }
      }
      if (response.body.RelatedTopics[2]) {
        if (response.body.RelatedTopics[2].Text) {
          text += `\n${response.body.RelatedTopics[2].Text}`;
        } else {
          text += `\n${response.body.RelatedTopics[2].Topics[0].Text}`;
        }
      }
      if (response.body.RelatedTopics[3]) {
        if (response.body.RelatedTopics[3].Text) {
          text += `\n${response.body.RelatedTopics[3].Text}`;
        } else {
          text += `\n${response.body.RelatedTopics[3].Topics[0].Text}`;
        }
      }
      if (response.body.RelatedTopics[4]) {
        if (response.body.RelatedTopics[4].Text) {
          text += `\n${response.body.RelatedTopics[4].Text}`;
        } else {
          text += `\n${response.body.RelatedTopics[4].Topics[0].Text}`;
        }
      }
      if (response.body.AbstractURL) text += `\n<${response.body.AbstractURL}>`;
      if (response.body.Image) text += `\n${response.body.Image}`;
    } else {
      text += `${T('ddg_error', lang)}: ${suffix}`;
    }
    return text;
  });
}

export default {
  d: ddg,
  ddg,
  duck: ddg,
  duckduckgo: ddg,
  s: ddg,
  search: ddg
};

export const help = {
  ddg: {parameters: ['search terms']}
};
