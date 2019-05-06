# Gravebot

[![Build Status](https://david-dm.org/gravebot/gravebot.svg)](https://david-dm.org/gravebot/gravebot)
[![Build Status](https://travis-ci.org/Gravebot/Gravebot.svg?branch=master)](https://travis-ci.org/Gravebot/Gravebot)
[![Coverage Status](https://img.shields.io/coveralls/Gravebot/Gravebot/master.svg)](https://coveralls.io/github/Gravebot/Gravebot?branch=master)
<a href="https://zenhub.io"><img src="https://img.shields.io/badge/KanBan%20Board-Zenhub.io-blue.svg"></a>
[![Translations](https://img.shields.io/badge/Translations-Transifex-135d91.svg)](https://www.transifex.com/gravebot/gravebot/)
[![Discord](https://discordapp.com/api/guilds/128598463947472897/widget.png)](https://discord.gg/0iXEgtjdHgkpdsVr)


__Project on hiatus.__ https://dustinblackman.com/posts/2019/05/hiatus-from-open-source/

## About

A fantastic, helpful, and fun [Discord](https://discordapp.com) chat and music bot! Gravebot comes with a bunch of cool and powerful commands for both Discord and games!

## [Changelog](CHANGELOG.md)

## How to use
#### Invitation

Deprecated, see [here](#localconfig) for self hosting.

~~The easiest way to set this bot up on your server is to invite it to your Discord server. It is currently hosted 24/7 and will always get the newest features first.~~

~~In order to do that, just [click here](https://discordapp.com/oauth2/authorize?&client_id=170664340968570880&scope=bot&permissions=305261590) and choose a server. You need to have **Manage Server** permission on that server. You may remove some of the permissions if you wish, but be warned it may break current and upcoming features.~~

~~If you want to give the bot a first try, you may do that in the [Gravebot's Lair](https://discord.gg/0iXEgtjdHgkpdsVr) Discord server.~~

~~If you have any questions, feedback, or want to request features, you may also do that by leaving a message in [Gravebot's Lair](https://discord.gg/0iXEgtjdHgkpdsVr), using the `!feedback` command, private messaging Gravestorm or Zalik, as well as opening an [issue on Github](https://github.com/Gravebot/Gravebot/issues/new).~~

## Commands
#### Help:
- `!help fun` - List of fun commands
- `!help useful` - List of useful commands
- `!help info` - List of information commands
- `!help games` - List of game commands
- `!help other` - List of other commands
- `!help all` - List all available commands in private chat
- `!memelist` - List of meme names for the `!meme` command
- `!setlanguage` - Set all help text to respond in a specified language

#### Fun:
- `!8ball` *question* - Answers the question
- `!animals` - Get various animal pictures
- `!cat` bomb *count* - Bombs chat with adorable cats
- `!pug` bomb *count* - Bombs chat with adorable pugs
- `!snake` bomb *count* - Bombs chat with adorable snakes
- `!chat` *text* - Chats with you
- `!coin` - Flips a coin
- `!comics` - Get a random comic from a bunch of different artists
- `!decide` *something* **or** *something...* - Decides between given words
- `!drama` *number* - Responds with a drama image, if no number is written, a random one
- `!emoji` *number* - Responds with an emoji copypasta, if no number is written, a random one
- `!meme` *meme name "top text" "bottom text"* -  Creates a meme with the given meme name and text
- `!quote` *number* - Responds with a quote, if no number is written, a random one
- `!robohash` - Get robot and monster images
- `!monster` - Get your personal monster
- `!robot` - Get your personal robot
- `!robothead` - Get your personal robot head
- `!roll` *times sides* - Rolls the dice a number of times with a number of sides, see **`!random`** for advanced generators
- `!translate` - Translate text in funny ways
- `!leet` *sentence* - 1337ifies the sentence
- `!snoop` *sentence* - Snoopifies tha sentence
- `!yoda` *sentence* - Yodaifies the sentence

#### Useful:
- `!ddg` *search terms* - Search the web, can also calculate and convert. Search other websites by appending its shortening (e.g. `!ddg !yt Hello`) See https://duckduckgo.com/bang for a list
- `!gif` *gif tags* - Gets a gif from Giphy or Popkey matching the given tags. Use `!giphy` or `!popkey` to search the specific site
- `!join` - Shows a link that can be used to invite the bot to your server
- `!paste` *text* - Creates a paste on Pastebin and returns the url
- `!random` - Generate truly random numbers and strings
- `!fraction` *amount* *decimal places* *replace(optional)* - Generate a number of random real numbers between 0 and 1 with set decimal places, write **replace** at the end to disable duplicates (e.g. __!fraction 1 5 replace__)
- `!gaussian` *amount* *mean* *deviation* *significant digits* - Generate a number of random numbers from a Gaussian distribution (e.g. __!gaussian 1 50 10 5__)
- `!integer` *amount* *min* *max* *replace(optional)* - Generate a number of random integers between min and max, write **replace** at the end to disable duplicates (e.g. __!integer 2 1 50 replace__)
- `!string` *amount* *length* *charset(optional)* *replace(optional)* - Generate a number of random strings of a given length, can also input your own charset (default is the alphabet), as well as write **replace** at the end to disable duplicates (e.g. __!string 1 10 abc123 replace__)
- `!unshorten` *url* - Unshortens a shortened link
- `!urban` *search terms* - Returns the summary of the first matching search result from Urban Dictionary
- `!videocall` *__Optional__ @username* - Start a one click video call or screenshare directly on Appear.in. Mention users to make it private
- `!wiki` *search terms* - Returns the summary of the first matching search result from Wikipedia
- `!wolfram` *query* - Query Wolfram Alpha for almost anything
- `!youtube` *video tags* - Gets a video from Youtube matching the given tags

#### Information:
- `!avatar` *username* - Responds with your avatar, unless a username is specified
- `!channelinfo` *channelname* - Gives information about this channel, unless a channelname is specified
- `!feedback` *text* - Give feedback and report bugs about the bot
- `!ping` - Pong! Check Gravebot's pulse
- `!serverinfo` *servername* - Gives information about this server, unless a servername is specified
- `!servers` - Lists how many servers, channels and users the bot is connected to
- `!uptime` - Shows how long the bot has been online
- `!userinfo` *username* - Gives information about this user, unless a username is specified
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
- `!lol best` *position* - Get the top 10 best Champions for a Position
- `!lol counters` *champ-name position* - Get the top 10 counters for a Champion and Position
- `!lol items` *champ-name position* - Get the highest win item sets for a Champion and Position
- `!lol match` *region summoner-name* - Get the name, rank, Champion, winrate and total games for all players of a __current__ match
- `!lol skills` *champ-name position* - Get the highest win skills for a Champion and Position
- `!lol status` - Get the LoL Game and Client server status for all regions

**Overwatch**
- `!ow` - Help
- `!ow averages` *region battletag* - Player average stats
- `!ow eliminations` *region battletag* - Heroes with the most eliminations per life
- `!ow games won` *region battletag* - Heroes with the most wins
- `!ow kill streak` *region battletag* - Heroes with the highest kill streak
- `!ow multikill` *region battletag* - Heroes with the most multikills
- `!ow objective kills` *region battletag* - Heroes with the most objective kills
- `!ow time played` *region battletag* - Heroes most played
- `!ow weapon accuracy` *region battletag* - Heroes weapon accuracy percentage
- `!ow win percent` *region battletag* - Heroes with the highest win percentage

#### Other:
- `!ayylmao`
- `!chillinmyb`
- `!endall`
- `!feelsbadman`
- `!feelsgoodman`
- `!jpeg`
- `!kappa`
- `!kappaHD`
- `!skeltal`
- `!starwars4`
- `!starwars5`

---

<a name="localconfig" />

## Local Installation
#### Windows:
**Warning**: Windows may have issues, even if all steps are done, sadly, we are not able to find the right dependencies for it (mostly regarding League of Legends and Wolfram commands), if you are familiar with coding, you can try messing around, either finding the right dependencies, or disabling the commands. If you are not familiar with coding, I would advise you to try out Linux, just install it alongside Windows and give it like 20GB of space, it will be plenty and you will have a good experience. Feel free to ask for help regarding installation in Gravebot's Lair, just keep this in mind.

- Install [Node.js v4.8.3](https://nodejs.org/en)
- Install [Python v2.7.13](https://www.python.org/downloads)
- Install [Microsoft Visual Studio C++ Express](http://go.microsoft.com/?linkid=9816758)
- Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [command prompt](http://windows.microsoft.com/en-us/windows/command-prompt-faq) and write `npm install -g node-gyp`)
- Install [libxml2](https://www.zlatkovic.com/libxml.en.html) and add it to your PATH (note that this may not work and some extra tinkering may be needed, if you find a better way of installing it, please share it)
- If you are unable to install it, you may remove the `wolfram-alpha` dependency line from `package.json` and delete `wolfram.js` in the `Gravebot/src/commands/useful` folder. That is the only command that uses libxml2.
- Install and run [Redis](http://redis.io/download#installation)
- Download Gravebot (open the [command prompt](http://windows.microsoft.com/en-us/windows/command-prompt-faq) and write `git clone https://github.com/Gravebot/Gravebot.git` or if you don't have/want to use [git](https://git-scm.com/downloads), download the ZIP by clicking the green Download button at the top right of this page)
- Rename `config.js.example` to `config.js` in the Gravebot directory and fill in the required information. Note that only variables with the `*Required*` comment are needed, everything else is optional
- [cd](https://en.wikipedia.org/wiki/Cd_%28command%29) to the Gravebot directory and run `npm install` to install the Node dependencies
- Run `npm start` in the Gravebot directory to start the bot

#### Linux:
- Install [Node.js v4.8.3](https://nodejs.org/en)
- Install [ffmpeg](https://ffmpeg.org), [gcc](https://gcc.gnu.org), [git](https://git-scm.com), [libxml2](http://www.xmlsoft.org) and [python](https://www.python.org) (open the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal) and write `sudo apt-get install build-essential python git libxml2-dev ffmpeg libfontconfig1`)
- Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal) and write `sudo npm install -g node-gyp`)
- Install and run [Redis](http://redis.io/download#installation)
- Download Gravebot (open the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal) and write `git clone https://github.com/Gravebot/Gravebot.git` or if you don't have/want to use [git](https://git-scm.com/downloads), download the ZIP by clicking the green Download button at the top right of this page)
- Rename `config.js.example` to `config.js` in the Gravebot directory and fill in the required information. Note that only variables with the `*Required*` comment are needed, everything else is optional
- [cd](https://en.wikipedia.org/wiki/Cd_%28command%29) to the Gravebot directory and run `npm install` to install the Node dependencies
- Run `npm start` in the Gravebot directory to start the bot

#### Mac:
- Install [Node.js v4.8.3](https://nodejs.org/en)
- Install [Python v2.7.13](https://www.python.org/downloads)
- Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [terminal](http://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line) and write `sudo npm install -g node-gyp`)
- Install and run [Redis](http://redis.io/download#installation)
- Download Gravebot (open the [terminal](http://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line) and write `git clone https://github.com/Gravebot/Gravebot.git` or if you don't have/want to use [git](https://git-scm.com/downloads), download the ZIP by clicking the green Download button at the top right of this page)
- Rename `config.js.example` to `config.js` in the Gravebot directory and fill in the required information. Note that only variables with the `*Required*` comment are needed, everything else is optional
- [cd](https://en.wikipedia.org/wiki/Cd_%28command%29) to the Gravebot directory and run `npm install` to install the Node dependencies
- Run `npm start` in the Gravebot directory to start the bot


## Deployment
#### Heroku

Gravebot comes setup and ready for [Heroku](https://www.heroku.com).

1. Setup your configuration in Heroku's app settings, environment variables.
2. Setup the buildpacks in Heroku's app settings by clicking Add buildpack and selecting NodeJS, as well as adding the following buildpack for music commands `https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git`
3. Push the source code.

#### Docker

Master branch is built and pushed to our Docker image. You can pull the latest from [here](https://hub.docker.com/r/gravebot/gravebot).


## Updating

Updating Gravebot is like any other Node.js app. Just run `git pull && npm install` in the Gravebot folder via the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal) if you're on Linux or the [command prompt](http://windows.microsoft.com/en-us/windows/command-prompt-faq) if you're on Windows. You may also download the ZIP, configure it and run npm install again.

---

## Feature Requests

Have a feature in mind? We'd love to hear about it. Feel free to [open an issue](https://github.com/Gravebot/Gravebot/issues/new) and let us know.

## Contribute

Want to contribute to Gravebot? That's great! Be sure to check out the [CONTRIBUTE.md](CONTRIBUTE.md) doc for more information on how.

## Contributors

- Gravestorm  *(Maintainer)* - [@Gravestorm](https://github.com/Gravestorm)
- Dustin Blackman *(Maintainer)* - [@dustinblackman](https://github.com/dustinblackman)

## [License](LICENSE)
