import chalk from 'chalk';
import nconf from 'nconf';
import path from 'path';
import R from 'ramda';

import meme from './meme';
import T from '../../translate';


const help_parameters = {};
const categories = {
  help: [],
  info: [],
  fun: [],
  games: [],
  useful: [],
  other: []
};

// Temporary workaround to fix tests failing.
if (!process.env.TEST) {
  const command_files = require('../').command_files;

  // Merge all the help objects together
  R.forEach(js_path => {
    const help_data = require(js_path).help;
    if (help_data) {
      const dir_name = path.basename(path.dirname(js_path));
      R.forEach(command => {
        const category = help_data[command].category || dir_name;
        if (!categories[category]) return console.log(chalk.yellow(`[WARN] ${command} does not have a category. It will not be added to the help information.`));

        categories[category].push(command);
        help_parameters[command] = help_data[command];
      }, R.keys(help_data));
    }
  }, command_files);
}

export function subCommands(bot, msg, method) {
  const lang = msg.author.lang;
  const subcommands = R.sort(R.prop('name'))(help_parameters[method].subcommands);

  let text = R.map(subcommand => {
    const trans_key = `${method}_${subcommand.name}`;
    const translation = T(trans_key, lang);
    if (!translation) return;

    const secondary_name = subcommand.secondary_name ? `\` or \`${subcommand.secondary_name}` : '';
    const parameters = !R.is(String, subcommand.parameters) ? R.join(' ', subcommand.parameters || []) : subcommand.parameters;

    return `**\`${method}\`** \`${subcommand.name}${secondary_name} ${parameters}\`
    ${translation}`;
  }, subcommands);

  text = R.join('\n', R.reject(R.isNil, text));
  if (help_parameters[method].header_text) {
    const header_text = T(help_parameters[method].header_text, lang);
    text = `${header_text}\n\n${text}`;
  }

  return bot.sendMessage(msg.channel, text);
}

// E.g. !help useful
function helpCategory(category, lang = 'en') {
  const methods = categories[category].sort();
  const text = R.map(name => {
    const translation = T(name, lang);
    if (!translation && category !== 'other') return;

    const parameters = !R.is(String, help_parameters[name].parameters) ? R.join(' ', help_parameters[name].parameters || []) : help_parameters[name].parameters;
    let text = `**\`${nconf.get('PREFIX')}${name}\`**`;
    if (parameters) text += ` \`${parameters}\``;
    if (translation) text += `\n\t\t${translation}`;

    return text;
  }, methods);

  return R.join('\n', R.reject(R.isNil, text));
}

function help(bot, msg, suffix) {
  const lang = msg.author.lang;
  const category = suffix.toLowerCase();
  if (categories[category]) return bot.sendMessage(msg.channel, helpCategory(category, lang));

  const help_methods = R.keys(categories).sort();
  help_methods.push('memelist');
  help_methods.splice(help_methods.indexOf('help'), 1);

  const text = R.map(param => {
    return `**\`${nconf.get('PREFIX')}help\`** \`${param}\`
    ${T('help_' + param, lang)}`;
  }, help_methods);

  // Adds commands that aren't just `help`;
  R.forEach(name => {
    const translation = T(name, lang);
    if (!translation) return;

    const parameters = !R.is(String, help_parameters[name].parameters) ? R.join(' ', help_parameters[name].parameters || []) : help_parameters[name].parameters;

    let command_text = `**\`${nconf.get('PREFIX')}setlang\`**`;
    if (parameters) command_text += ` \`${parameters}\``;
    if (translation) command_text += `\n\t\t${translation}`;
    text.push(command_text);
  }, categories.help);

  return bot.sendMessage(msg.channel, R.join('\n', text));
}

function memelist(bot, msg, suffix) {
  suffix = suffix.toLowerCase();
  if (suffix === '1') {
    bot.sendMessage(msg.author, meme.list1);
  } else if (suffix === '2') {
    bot.sendMessage(msg.author, meme.list2);
  } else if (suffix === '3') {
    bot.sendMessage(msg.author, meme.list3);
  } else if (suffix === 'full') {
    bot.sendMessage(msg.author, meme.list1);
    bot.sendMessage(msg.author, meme.list2);
    bot.sendMessage(msg.author, meme.list3);
  } else {
    bot.sendMessage(msg.channel, meme.all);
  }
}

export default {
  commands: help,
  help,
  memelist
};
