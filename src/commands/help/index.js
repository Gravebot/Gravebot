import chalk from 'chalk';
import glob from 'glob';
import nconf from 'nconf';
import path from 'path';
import R from 'ramda';


import { command_files } from '../';
import meme from './meme';

// TOOD: Remove
import english from './english';


const translations_path = path.join(__dirname, '../../../i18n');
const translations = R.fromPairs(R.map(file_path => {
  return [path.basename(file_path).replace(/.json/g, ''), require(file_path)];
}, glob.sync(`${translations_path}/*(!(_source.json))`)));

const help_parameters = {};
const categories = {
  info: [],
  fun: [],
  games: [],
  useful: [],
  other: [] // Prefil here.
};

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

export function subCommands(bot, msg, method, lang = 'en') {
  const subcommands = R.sort(R.prop('command'))(help_parameters[method].subcommands);

  let text = R.map(subcommand => {
    const trans_key = `${method}_${subcommand.name}`;
    const translation = translations[lang][trans_key] || translations.en[trans_key];
    if (!translation) return console.log(chalk.yellow(`[WARN] ${trans_key} does not haev a translation`));
    const parameters = R.join(' ', subcommand.parameters || []);

    return `**\`${method} ${subcommand.name} ${parameters}\`**
    ${translation}`;
  }, subcommands);

  text = R.join('\n', R.reject(R.isNil, text));
  if (subcommands.header_text) {
    const header_text = translations[lang][subcommands.header_text] || translations.en[subcommands.header_text];
    text = `${header_text}\n\n${text}`;
  }

  console.log(text);

  return bot.sendMessage(msg.channel, text);
}

// Default `!help`
function helpInit(lang = 'en') {
  const help_methods = R.keys(categories).sort();
  help_methods.push('memelist');

  const text = R.map(param => {
    return `**\`${nconf.get('PREFIX')}help ${param}\`**
    ${translations[lang]['help_' + param]}`;
  }, help_methods);

  return R.join('\n', text);
}

// E.g. !help useful
function helpCategory(methods, lang = 'en') {
  methods.sort();

  const text = R.map(name => {
    const translation = translations[lang][name] || translations.en[name];
    if (!translation) return console.log(chalk.yellow(`[WARN] ${name} does not have a translation`));

    const parameters = R.join(' ', help_parameters[name].parameters || []);
    return `**\`${nconf.get('PREFIX')}${name} ${parameters}\`**
    ${translations[lang][name]}`;
  }, methods);

  return R.join('\n', R.reject(R.isNil, text));
}

function help(bot, msg, suffix) {
  const category = suffix.toLowerCase();
  if (categories[category]) return bot.sendMessage(msg.channel, helpCategory(categories[category]));
  return bot.sendMessage(msg.channel, helpInit());
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
  commands: (bot, msg) => {
    bot.sendMessage(msg.channel, english.all);
  },
  help,
  memelist
};
