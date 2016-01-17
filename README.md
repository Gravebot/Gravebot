# Gravebot

[![Build Status](https://david-dm.org/gravestorm/gravebot.svg)](https://david-dm.org/gravestorm/gravebot)
[![Build Status](https://travis-ci.org/Gravestorm/Gravebot.svg?branch=master)](https://travis-ci.org/Gravestorm/Gravebot)
[![Coverage Status](https://img.shields.io/coveralls/Gravestorm/Gravebot/master.svg)](https://coveralls.io/github/Gravestorm/Gravebot?branch=master)
<a href="https://zenhub.io"><img src="https://img.shields.io/badge/KanBan%20Board-Zenhub.io-blue.svg"></a>

## About

A fantastic, helpful, and fun [Discord](https://discordapp.com/) chat bot! Gravebot comes with a bunch of cool and powerful commands for both Discord and games!

[Russian version/Pусская версия](https://github.com/Gravestorm/GravebotRU).

## [Changelog](CHANGELOG.md)

## How to use
#### Invitation
The easiest way to set this bot up on your server is to invite it to your Discord server, It is currently hosted 24/7 and will always get the newest features first.

Join [Gravebot's Lair](https://discord.gg/0iXEgtjdHgkpdsVr) and either PM Gravebot an invite or write in the general chat !join **invite-link-here** (e.g. https://discord.gg/0iXEgtjdHgkpdsVr **or** 0iXEgtjdHgkpdsVr). You can also give the bot a first try in that room as well.

If you have any questions, feedback or want to request features, you may also do that by leaving a message in the [Gravebot's Lair](https://discord.gg/0iXEgtjdHgkpdsVr), private messaging Gravestorm, as well as opening an [issue on Github](https://github.com/Gravestorm/Gravebot/issues/new).

For self hosting, click [here](#localconfig).

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
- `!youtube` *video tags* - Gets a video from Youtube matching the given tags
- `!wolfram` *query* - Query Wolfram Alpha for almost anything
- `!videocall` *__Optional__ @username* - Start a one click video call or screenshare directly on Appear.in. Mention users to make it private.

#### Information:
- `!avatar` *@username* - Responds with the avatar of the user, if no user is written, the avatar of the sender
- `!serverinfo` - Gives information about the server
- `!serverlist` - Lists all the servers the bot is connected to
- `!servers` - Lists how many servers, channels and users the bot is connected to
- `!uptime` - Shows how long the bot has been online
- `!userinfo` *@username* - Gives information about the user, if no user is written, yourself
- `!version` - Get information on the latest version of Gravebot

#### Games:

**Dota2**
- `!dota2` - Help
- `!dota2 best` *position* - Get the top 10 Heroes for a specific position
- `!dota2 build` *hero-name* - Get the most popular build for a Hero
- `!dota2 counters` *hero-name* - Get the top 10 counters for a Hero
- `!dota2 impact` - Get the top 10 Heroes with the biggest impact
- `!dota2 items` *hero-name* - Get the top 10 most used items for a Hero

**League of Legends**
- `!lol` - Help
- `!lol bans` - Get the top 10 most common bans
- `!lol best` *position* - Get the top 10 best champs for a position
- `!lol counters` *champ-name position* - Get the top 10 counters for a Champion and Position
- `!lol items` *champ-name position* - Get the highest win item sets for a Champion and Position
- `!lol match` *region summoner-name* - Get rank, champ, winrate, and games for all players in a __current__ match.
- `!lol skills` *champ-name position* - Get the highest win skills for a Champion and Position
- `!lol status` - Get the LoL Game and Client server status for all regions


#### Other:
- `!ayylmao`
- `!chillenmyb`
- `!endall`
- `!feelsgoodman`
- `!kappa`
- `!kappaHD`
- `!skeltal`
- `!starwars4`
- `!starwars5`

---

<a name="localconfig" />
## Local Configuration

Rename `config.js.example` to `config.js` and fill in the required information. Note only variables with the `*Required*` comment are needed, everything else is optional.

## Local Installation
#### Windows:
- Install [node.js](https://nodejs.org/en/) v4.0 or higher
- Install [python v2.7.3](https://www.python.org) ([32 bit](https://www.python.org/ftp/python/2.7.3/python-2.7.3.msi), [64 bit](https://www.python.org/ftp/python/2.7.3/python-2.7.3.amd64.msi))
- Install [Microsoft Visual Studio C++ Express](http://go.microsoft.com/?linkid=9816758)
- Install [libxml2](https://www.zlatkovic.com/pub/libxml/) and add it to your PATH (note that this may not work and some extra tinkering may be needed, if you find a better way of installing it, please share it)
- Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [command prompt](http://windows.microsoft.com/en-us/windows/command-prompt-faq) and write `npm install -g node-gyp`)
- Run `npm-install.bat` to install the Node dependencies
- Run `launch.bat` to start the bot

#### Linux:
- Install [node.js](https://nodejs.org/en/) v4.0 or higher
- Install [gcc](https://gcc.gnu.org) and [libxml2](http://www.xmlsoft.org/) (open the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal/) and write `sudo apt-get install build-essential libxml2-dev`)
- Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal/) and write `sudo npm install -g node-gyp`)
- [cd](https://en.wikipedia.org/wiki/Cd_%28command%29) to the root directory and run `npm install`
- Run `npm start`

## Deployment
#### Heroku

Gravebot comes setup and ready for Heroku. Setup your configuration in Heroku's environment variables and then push the source code.

#### Docker

Master branch is built and pushed to our Docker image. You can pull the latest from [here](https://hub.docker.com/r/gravebot/gravebot/).

---

## Feature Requests

Have a feature in mind? We'd love to hear about it. Feel free to [open an issue](https://github.com/Gravestorm/Gravebot/issues/new) and let us know.

## Contribute

Want to contribute to Gravebot? That's great! Be sure to check out the [CONTRIBUTE.md](CONTRIBUTE.md) doc for more information on how.

## Contributors

- Gravestorm  *(Maintainer)* - [@Gravestorm](https://github.com/Gravestorm)
- Dustin Blackman *(Maintainer)* - [@dustinblackman](https://github.com/dustinblackman)

## [License](LICENSE)
