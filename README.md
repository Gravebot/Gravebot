# FurBot - A less safe Gravebot fork

[![Build Status](https://david-dm.org/gravebot/gravebot.svg)](https://david-dm.org/gravebot/gravebot)
[![Build Status](https://travis-ci.org/Gravebot/Gravebot.svg?branch=master)](https://travis-ci.org/Gravebot/Gravebot)
[![Coverage Status](https://img.shields.io/coveralls/Gravebot/Gravebot/master.svg)](https://coveralls.io/github/Gravebot/Gravebot?branch=master)
<a href="https://zenhub.io"><img src="https://img.shields.io/badge/KanBan%20Board-Zenhub.io-blue.svg"></a>
[![Translations](https://img.shields.io/badge/Translations-Transifex-135d91.svg)](https://www.transifex.com/gravebot/gravebot/)

To ask questions, give tips or add features join:
[![Discord](https://discordapp.com/api/servers/175996953560219650/widget.png)](https://discord.gg/0ywxvQsINYBeyCXT)

## About

A fantastic, helpful, and fun [Discord](https://discordapp.com/) chat bot! FurBot comes with a bunch of cool and powerful commands for both Discord and games!

FurBot is a [Gravebot](https://github.com/Gravebot/Gravebot/) fork. If there are any issues within the main codebase i will need to wait for a fix. Currently the only thing seperating FurBot and Gravebot is the collection of **NSFW commands.**

## [Changelog](CHANGELOG.md)

## How to use
#### Invitation
The easiest way to set this bot up on your server is to invite it to your Discord server. It is currently hosted 24/7.

In order to do that, just [click here](https://discordapp.com/oauth2/authorize?&client_id=174176308396425217&scope=bot&permissions=125982) and choose a server. You need to have **Manage Server** permission on that server. You may remove some of the permissions if you wish, but be warned it may break current and upcoming features.

If you want to give the bot a first try, you may do that in the [FurBot Labs](https://discord.gg/0ywxvQsINYBeyCXT) Discord server.

For self hosting, click [here](#localconfig).

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
- `!roll` *times sides* - Rolls the dice a number of times with a number of sides
- `!translate` - Translate text in funny ways
- `!leet` *sentence* - 1337ifies the sentence
- `!snoop` *sentence* - Snoopifies tha sentence
- `!yoda` *sentence* - Yodaifies the sentence

#### Useful:
- `!gif` *gif tags* - Gets a gif from Giphy or Popkey matching the given tags (Use `!giphy` or `!popkey` to search the specific sites)
- `!join` - Shows a link that can be used to invite Gravebot to your server
- `!unshorten` *url* - Unshortens a shortened link
- `!urban` *search terms* - Returns the summary of the first matching search result from Urban Dictionary
- `!videocall` *__Optional__ @username* - Start a one click video call or screenshare directly on Appear.in. Mention users to make it private.
- `!wiki` *search terms* - Returns the summary of the first matching search result from Wikipedia
- `!wolfram` *query* - Query Wolfram Alpha for almost anything
- `!youtube` *video tags* - Gets a video from Youtube matching the given tags

#### Information:
- `!avatar` *username* - Responds with your avatar, unless a username is specified
- `!channelinfo` *channelname* - Gives information about this channel, unless a channelname is specified
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
- `!lol best` *position* - Get the top 10 best champs for a position
- `!lol counters` *champ-name position* - Get the top 10 counters for a Champion and Position
- `!lol items` *champ-name position* - Get the highest win item sets for a Champion and Position
- `!lol match` *region summoner-name* - Get rank, champ, winrate, and games for all players in a __current__ match.
- `!lol skills` *champ-name position* - Get the highest win skills for a Champion and Position
- `!lol status` - Get the LoL Game and Client server status for all regions

#### Lewd:
**e621**
- `!e6` *tag(s)* - Gives you an image from e621 with your given tag(s).
- `!e6 latest` *tag(s)* - Gives you the newest image from e621 with your given tag(s).
- `!e6 random` - Gives you a random image from e621.

**rule34**
- `!r34` *tag(s)* - Gives you an image from rule34 with your given tag(s).
- `!r34 latest` *tag(s)* - Gives you the newest image from rule34 with your given tag(s).
- `!r34 random` - Gives you a random image from rule34.

**gelbooru**
- `!gelbooru` *tag(s)* - Gives you an image from gelbooru with your given tag(s).
- `!gelbooru latest` *tag(s)* - Gives you the newest image from gelbooru with your given tag(s).
- `!gelbooru random` - Gives you a random image from gelbooru.

**danbooru**
- `!danbooru` *tag(s)* - Gives you an image from danbooru with your given tag(s).
- `!danbooru latest` *tag(s)* - Gives you the newest image from danbooru with your given tag(s).
- `!danbooru random` - Gives you a random image from danbooru.


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

## Big thanks to the Gravebot Developers:

- Gravestorm  *(Maintainer)* - [@Gravestorm](https://github.com/Gravestorm)
- Dustin Blackman *(Maintainer)* - [@dustinblackman](https://github.com/dustinblackman)

## [License](LICENSE)
