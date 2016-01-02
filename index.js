import { Client as Discord } from 'discord.js';
import commands from './lib/commands';

// Init
import CONFIG from './config';
const bot = new Discord();


bot.on('ready', () => console.log(`Started successfully. Serving in ${bot.servers.length} servers`));
bot.on('disconnected', () => {
  console.log(`[${Date().toString()}] Disconnected. Attempting to reconnect...`);
  setTimeout(() => {
    bot.login(CONFIG.email, CONFIG.password);
  }, 5000);
});

bot.on('message', msg => {
  // Checks if the message is a command
  if (msg.content[0] === CONFIG.prefix) {
    let command = msg.content.toLowerCase().split(' ')[0].substring(1);
    let suffix = msg.content.toLowerCase().substring(command.length + 2);
    let cmd = commands[command];

    if (cmd) cmd(bot, msg, suffix);
  }
});

bot.login(CONFIG.email, CONFIG.password);
