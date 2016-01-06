
[![Build Status](https://david-dm.org/gravestorm/gravebot.svg)](https://david-dm.org/gravestorm/gravebot)
[![Build Status](https://travis-ci.org/Gravestorm/Gravebot.svg?branch=master)](https://travis-ci.org/Gravestorm/Gravebot)
[![Coverage Status](https://img.shields.io/coveralls/Gravestorm/Gravebot/master.svg)](https://coveralls.io/github/Gravestorm/Gravebot?branch=master)

## About
A bot for the chat program [Discord](https://discordapp.com/), made with the help of [Discord.js library](https://github.com/hydrabolt/discord.js).

[Command list](https://github.com/Gravestorm/Gravebot#commands).

[Russian version/Pусская версия](https://github.com/Gravestorm/GravebotRU).

## [Changelog](CHANGELOG.md)

## How to use
#### Invitation
The easiest way to set this bot up on your server is to invite it to your Discord server, it is currently hosted 24/7.

In order to do that, join [Gravebot's Lair](https://discord.gg/0iXEgtjdHgkpdsVr) and write in the main chat !join **invitation link** (e.g. https://discord.gg/0iXEgtjdHgkpdsVr **or** 0iXEgtjdHgkpdsVr), you may also test it there as much as you like.

If you have any questions, feedback or want to request features, you may also do that by leaving a message in the [Gravebot's Lair](https://discord.gg/0iXEgtjdHgkpdsVr), or private messaging Gravestorm.

Though, if you still want to host it yourself, or mess around with the code, keep reading.

## Configure

Rename `config.js.example` to `config.js` and fill in the required information. Note only variables with the `*Required*` comment are needed, everything else is optional.

## Installation
#### Windows:
- Install [node.js](https://nodejs.org/en/) v4.0 or higher
- Install [python v2.7.3](https://www.python.org) ([32 bit](https://www.python.org/ftp/python/2.7.3/python-2.7.3.msi), [64 bit](https://www.python.org/ftp/python/2.7.3/python-2.7.3.amd64.msi))
- Install [Microsoft Visual Studio C++ Express](http://go.microsoft.com/?linkid=9816758)
- Install [libxml2](ftp://ftp.zlatkovic.com/libxml/)
- Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [command prompt](http://windows.microsoft.com/en-us/windows/command-prompt-faq) and write `npm install -g node-gyp`)
- Run `npm-install.bat` to install the Node dependencies
- Run `launch.bat` to start the bot

#### Linux:
- Install [node.js](https://nodejs.org/en/) v4.0 or higher
- Install [gcc](https://gcc.gnu.org) and [libxml2](http://www.xmlsoft.org/) (open the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal/) and write `sudo apt-get install g++ libxml2-dev`)
- Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal/) and write `sudo npm install -g node-gyp`)
- [cd](https://en.wikipedia.org/wiki/Cd_%28command%29) in the root directory and run `npm install`
- `npm start`

## Feature Requests

Have a feature in mind? We'd love to hear about it. Feel free to [open an issue](https://github.com/Gravestorm/Gravebot/issues/new) and let us know.

## Contribute

Want to contribute to Gravebot? That's great! Be sure to check out the [CONTRIBUTE.md](CONTRIBUTE.md) doc for more information on how.

## Commands
#### Help:
- `!help fun` - List of fun commands
- `!help useful` - List of useful commands
- `!help info` - List of information commands
- `!help games` - List of game commands
- `!help other` - List of other commands
- `!memelist` - List of meme names for the `!meme` command
- `!aide` - Liste des commandes en Francais

#### Fun:
- `!8ball` *question* - Answers the question
- `!chat` *sentence* - Chats with you
- `!coin` - Flips a coin
- `!decide` *something* **or** *something...* - Decides between given words
- `!drama` *number* - Responds with a drama image, if no number is written, a random one
- `!emoji` *number* - Responds with an emoji copypasta, if no number is written, a random one
- `!meme` *meme name "top text" "bottom text"* -  Creates a meme with the given meme name and text
- `!pugbomb` *count* - Bombs chat with adorable pugs
- `!quote` *number* - Responds with a quote, if no number is written, a random one
- `!roll` *times sides* - Rolls the dice a number of times with a number of sides
- `!snoopify` *sentence* - Snoopifies tha sentence
- `!yoda` *setence* - Yodaify a sentence

#### Useful:
- `!gif` *gif tags* - Gets a gif from Giphy matching the given tags
- `!join` *invitation link* - Joins the server the bot is invited to
- `!urban` *search terms* - Returns the summary of the first matching search result from Urban Dictionary
- `!wiki` *search terms* - Returns the summary of the first matching search result from Wikipedia
- `!yt` *video tags* - Gets a video from Youtube matching the given tags
- `!wolfram` *query* - Query Wolfram Alpha for almost anything

#### Information:
- `!avatar` *@Username* - Responds with the Avatar of the user, if no user is written, the avatar of the sender
- `!serverinfo` - Gives information about the server
- `!serverlist` - Lists all the servers the bot is connected to
- `!servers` - Lists how many servers, channels and users the bot is connected to
- `!uptime` - Shows how long the bot has been online
- `!userinfo` *@username* - Gives information about the user, if no user is written, yourself

#### Games:
- `!lol` - League of Legends

#### Other:
- `!ayylmao`
- `!chillenmyb`
- `!feelsgoodman`
- `!kappa`
- `!kappaHD`
- `!skeltal`
- `!starwars4`
- `!starwars5`

## Contributors

- Gravestorm - [@Gravestorm](https://github.com/Gravestorm)
- Dustin Blackman - [@dustinblackman](https://github.com/dustinblackman)

## [License](LICENSE)
