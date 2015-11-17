# About
A bot for the chat program [Discord](https://discordapp.com/), made with the help of [Discord.js library](https://github.com/hydrabolt/discord.js).

[Command list](https://github.com/Gravestorm/Gravebot#commands).

[![Build Status](https://david-dm.org/gravestorm/gravebot.svg)](https://david-dm.org/gravestorm/gravebot)
[![Build Status](https://travis-ci.org/Gravestorm/Gravebot.svg?branch=master)](https://travis-ci.org/Gravestorm/Gravebot)

# How to use
# Invitation
The easiest way to set this bot up on your server is to invite it to your Discord server, it is currently hosted 24/7.

In order to do that, join the [Discord Bots](https://discord.gg/0cDvIgU2voWn4BaD) server and private message it with !join-server **invitation link** (e.g. https://discord.gg/0cDvIgU2voWn4BaD **or** 0cDvIgU2voWn4BaD)

Though, if you still want to host it yourself, or mess around with the code, keep reading.

## Preparation
### Windows:
Install [node.js](https://nodejs.org/en/)

Install [python v2.7.3](https://www.python.org) ([32 bit](https://www.python.org/ftp/python/2.7.3/python-2.7.3.msi), [64 bit](https://www.python.org/ftp/python/2.7.3/python-2.7.3.amd64.msi))

Install [Microsoft Visual Studio C++ Express](http://go.microsoft.com/?linkid=9816758)

Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [command prompt](http://windows.microsoft.com/en-us/windows/command-prompt-faq) and write **npm install -g node-gyp**)

See [Launching the bot](https://github.com/Gravestorm/Gravebot#launching-the-bot)

### Linux:
Install [node.js](https://nodejs.org/en/)

Install [gcc](https://gcc.gnu.org) (open the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal/) and write **sudo apt-get install g++**)

Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal/) and write **sudo npm install -g node-gyp**)

See [Launching the bot](https://github.com/Gravestorm/Gravebot#launching-the-bot)

## Launching the bot:
Rename **config.json.example** to **config.json** and fill in the required information

Double click **npm install.bat**

Double click **Launch.bat**

# Commands:
##Help commands:
**!help fun** => List of fun commands

**!help useful** => List of useful commands

**!help info** => List of information commands

**!aide** => Liste des commandes

**!memelist** => List of meme names for the !meme command

##Fun commands:
**!8ball** *question* => Answers the question

**!chat** *sentence* => Chats with you

**!decide** *something or something or something...* => Decides between given words

**!meme** *meme name "top text" "bottom text"* => Creates a meme with the given meme name and text

**!quote** => Writes a random quote

**!rick** *number ricks* => Ricks the dice with a number of sides, if no number is written, six-sided

**!roll** *number* => Rolls the dice with a number of sides, if no number is written, six-sided

**!snoopify** *sentence* => Snoopifies tha sentence

##Useful commands:
**!avatar** *@Username* => Responds with the Avatar of the user, if no user is written, the avatar of the sender

**!gif** *gif tags* => Gets a gif from Giphy matching the given tags

**!image** *image tags* => Gets an image from Google matching the given tags

**!join-server** *invitation link* => Joins the server the bot is invited to

**!urban** *search terms* => Returns the summary of the first matching search result from Urban Dictionary

**!wiki** *search terms* => Returns the summary of the first matching search result from Wikipedia

**!youtube** *video tags* => Gets a video from Youtube matching the given tags

##Information commands:
**!ayylmao** => All dayy lmao

**!kappa** => Kappa

**!myid** => Responds with the user ID of the sender

**!servers** => Lists all the servers the bot is connected to

**!uptime** => Shows how long the bot has been online
