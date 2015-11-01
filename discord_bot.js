var Discord = require("discord.js");
var AuthDetails = require("./auth.json");

var yt = require("./youtube_plugin");
var youtube_plugin = new yt();

var gi = require("./google_image_plugin");
var google_image_plugin = new gi();

var multiline = require("multiline");
var qs = require("querystring");

var config = {
    "api_key": "dc6zaTOxFJmzC",
    "rating": "r",
    "url": "http://api.giphy.com/v1/gifs/search",
    "permission": ["NORMAL"]
};

var help = multiline(function(){/*
```php
!avatar
     Responds with the Avatar image of the sender

!ayylmao
     All dayy lmao

!gif 'gif tags'
     Gets a gif from Giphy matching the given tags

!image 'image tags'
     Gets an image from Google matching the given tags

!join-server 'invite'
     Joins the server the bot is invited to

!kappa
     Kappa

!meme 'meme name "top text" "bottom text"'
     Creates a meme with the given meme name and text

!memehelp
     Lists available meme names

!myid
     Responds with the user ID of the sender

!roll
     Rolls the dice

!servers
     Lists all the servers the bot is connected to

!urban 'search terms'
     Returns the summary of the first matching search result from Urban Dictionary

!uptime
     Shows how long the bot has been online

!wiki 'search terms'
     Returns the summary of the first matching search result from Wikipedia

!youtube 'video tags'
     Gets a video from Youtube matching the given tags```
*/});

var aide = multiline(function(){/*
```php
!avatar
   Retourne l’avatar de l’utilisateur

!ayylmao
     All dayy lmao

!gif 'gif tags'
     Retourne un gif correspondant aux tags

!image 'image tags'
     Retourne une image correspondant aux tags

!join-server 'invite'
     Rejoint le serveur auquel le bot est invité

!kappa
     Kappa

!meme 'meme name "top text" "bottom text"'
     Crée un « meme » avec le texte choisis

!memehelp
     Liste tous les « meme » disponibles

!myid
     Retourne l’ID de l’utilisateur

!roll
     Fait rouler les dés

!servers
     Liste tous les serveurs auquel le bot est connecté

!urban 'search terms'
     Retourne la première définition de Urban Dictionary correspondant aux tags

!uptime
     Affiche la durée du bot en ligne

!wiki 'search terms'
     Retourne un résumé de la page Wikipedia correspondant aux tags

!youtube 'video tags'
     Retourne la vidéo youtube correspondant aux tags
```
*/});

var memehelp = multiline(function(){/*
```php
'aliens' - Ancient Aliens

'cold' - Freezing Jack Nicholson

'djpauly' - DJ Pauly

'doge' - Such wow Much meme

'drevil' - Dr Evil

'fry' - Not sure if ... or ...

'highguy' - High Guy

'idontalways' - I dont always ... but when I do ...

'jackiechan' - Jackie Chan WTF

'karate' - Karate Kyle

'lebowsky' - Confused Lebowsky

'mrbean' - If you know what I mean

'nappa' - No Nappa its a trick

'onedoesnot' - One does not simply

'spidermanbed' - Spiderman bed

'spidermandesk' - Spiderman desk

'spidermanrails' - Spiderman rails

'squidward' - Squidward beautiful vs ugly

'takemymoney' - Shut up ant take my money

'yodawg' - Yo Dawg

'yuno' - Y U No
```
*/});

//If you want to add more memes, go to https://imgflip.com/memetemplates click on the wanted meme and click Blank Template on the right, then just copy the ID and name it
var meme = {
  "aliens": 101470,
  "cold": 9106691,
  "djpauly": 2005809,
  "doge": 8072285,
  "drevil": 40945639,
  "fry": 61520,
  "highguy": 101440,
  "idontalways": 61532,
  "jackiechan": 412211,
  "karate": 61561,
  "lebowsky": 1195347,
  "mrbean": 583373,
  "nappa": 295701,
  "onedoesnot": 61579,
  "spidermanbed": 152145,
  "spidermandesk": 1366993,
  "spidermanrails": 413621,
  "squidward": 285870,
  "takemymoney": 176908,
  "yodawg": 101716,
	"yuno": 61527
};

var commands = {
    "aide": {
      process: function(bot, msg) {bot.sendMessage(msg.channel, aide);}
    },
    "avatar": {
      process: function(bot, msg){bot.sendMessage(msg.channel, msg.sender.avatarURL);}
    },
    "ayylmao": {
      process: function(bot, msg){bot.sendFile(msg.channel, "./images/Ayylmao.png");}
    },
    "commands": {
        process: function(bot, msg) {bot.sendMessage(msg.channel, help);}
    },
    "gif": {
         process: function(bot, msg, suffix) {
           var query = suffix;
           if(!query) {
               bot.sendMessage(msg.channel, "Usage: !gif **gif tags**");
               return;
           }
           var tags = suffix.split(" ");
           get_gif(tags, function(id) {
              if (typeof id !== "undefined") {
			            bot.sendMessage(msg.channel, "http://media.giphy.com/media/" + id + "/giphy.gif [Tags: " + (tags ? tags : "Random GIF") + "]");
			        }
              else {
			            bot.sendMessage(msg.channel, "Invalid tags, try something different. [Tags: " + (tags ? tags : "Random GIF") + "]");
			        }
		      });
		  }
    },
    "help": {
        process: function(bot, msg) {bot.sendMessage(msg.channel, help);}
    },
    "image": {
        process: function(bot, msg, suffix){
          var query = suffix;
          if(!query) {
              bot.sendMessage(msg.channel, "Usage: !image **image tags**");
              return;
          }
          google_image_plugin.respond(suffix, msg.channel, bot);}
    },
    "join-server": {
        process: function(bot, msg, suffix) {
          var query = suffix;
          if(!query) {
              bot.sendMessage(msg.channel, "Usage: !join-server **invite**");
              return;
          }
            console.log(suffix);
            console.log(bot.joinServer(suffix,function(error, server) {
                console.log("callback: " + arguments);
                if(error){
                    bot.sendMessage(msg.channel, "Failed to join: " + error);
                } else {
                    console.log("Joined server " + server);
                    bot.sendMessage(msg.channel, "Successfully joined " + server);
                }
            }));
        }
    },
    "kappa": {
      process: function(bot, msg){bot.sendFile(msg.channel, "./images/Kappa.png");}
    },
    "meme": {
            process: function(bot, msg, suffix) {
              var query = suffix;
              if(!query) {
                  bot.sendMessage(msg.channel, 'Usage: !meme **meme name** **"top text"** **"bottom text"**');
                  return;
              }
              var tags = msg.content.split('"');
              var memetype = tags[0].split(" ")[1];
              var Imgflipper = require("imgflipper");
              var imgflipper = new Imgflipper(AuthDetails.imgflip_username, AuthDetails.imgflip_password);
              imgflipper.generateMeme(meme[memetype], tags[1]?tags[1]:"", tags[3]?tags[3]:"", function(err, image){
                bot.sendMessage(msg.channel, image);
        });
      }
    },
    "memehelp": {
        process: function(bot, msg) {bot.sendMessage(msg.channel, memehelp);}
    },
    "myid": {
        process: function(bot, msg){bot.sendMessage(msg.channel, msg.author.id);}
    },
    "roll": {
    process: function(bot, msg, suffix) {
        var number = Math.floor(Math.random() * 6) + 1;
        bot.sendMessage(msg.channel, msg.sender + " Rolled " + number);
      }
    },
    "servers": {
        process: function(bot, msg){bot.sendMessage(msg.channel, bot.servers);}
    },
    "uptime": {
        process: function(bot, msg){
          var uptimeh = Math.floor((bot.uptime / 1000) / (60*60));
          var uptimem = Math.floor((bot.uptime / 1000) % (60*60) / 60);
          var uptimes = Math.floor((bot.uptime / 1000) % 60);
          bot.sendMessage(msg.channel, "I have been alive for:\n" + uptimeh + " Hours\n" + uptimem + " Minutes\n" + uptimes + " Seconds\n");
      }
    },
    "urban": {
        process: function(bot, msg, suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel, "Usage: !urban **search terms**");
                return;
            }
            var Urban = require('urban');
            Urban(suffix).first(function(json) {
                if (json !== undefined) {
                    var definition = "" + json.word + ": " + json.definition + "\n:arrow_up: " + json.thumbs_up + "   :arrow_down: " + json.thumbs_down + "\n\nExample: " + json.example;
                    bot.sendMessage(msg.channel,definition);
                }
                else
                { bot.sendMessage(msg.channel,"Sorry, I couldn't find a definition for: " + suffix);
              }
            });
        }
    },
    "wiki": {
        process: function(bot, msg, suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel, "Usage: !wiki **search terms**");
                return;
            }
            var Wiki = require('wikijs');
            new Wiki().search(query,1).then(function(data) {
                new Wiki().page(data.results[0]).then(function(page) {
                    page.summary().then(function(summary) {
                        var sumText = summary.toString().split('\n');
                        var continuation = function() {
                            var paragraph = sumText.shift();
                            if(paragraph){
                                bot.sendMessage(msg.channel, paragraph, continuation);
                            }
                        };
                        continuation();
                    });
                });
            },function(err){
                bot.sendMessage(msg.channel, err);
            });
        }
    },
    "youtube": {
    process: function(bot, msg, suffix){
        var query = suffix;
        if(!query) {
            bot.sendMessage(msg.channel, "Usage: !youtube **video tags**");
            return;
          }
        youtube_plugin.respond(suffix,msg.channel, bot);
      }
    }
};

var bot = new Discord.Client();

bot.on("ready", function () {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
  //Sets the game the bot will be shown as playing, change the number for a different game (there is a list somewhere, but I forgot where)
  bot.setPlayingGame(329);
});

bot.on("disconnected", function () {
    console.log(currentTime() + "Disconnected. Attempting to reconnect...");
    sleep(5000);
    bot.login(AuthDetails.email, AuthDetails.password);
});

bot.on("message", function (msg) {
	//Checks if the message is a command
	if(msg.author.id != bot.user.id && msg.content[0] === '!') {
		  var cmdTxt = msg.content.toLowerCase().split(" ")[0].substring(1);
      var suffix = msg.content.toLowerCase().substring(cmdTxt.length+2);
		  var cmd = commands[cmdTxt];
      if(cmd) {
    cmd.process(bot, msg, suffix);
		}
	}
});

function get_gif(tags, func) {
        //limit=1 will only return 1 gif
        var params = {
            "api_key": config.api_key,
            "rating": config.rating,
            "format": "json",
            "limit": 1
        };
        var query = qs.stringify(params);

        if (tags !== null) {
            query += "&q=" + tags.join('+')
        }

        var request = require("request");

        request(config.url + "?" + query, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.error("giphy: Got error: " + body);
                console.log(error);
            }
            else {
                var responseObj = JSON.parse(body)
                console.log(responseObj.data[0])
                if(responseObj.data.length){
                    func(responseObj.data[0].id);
                } else {
                    func(undefined);
                }
            }
        }.bind(this));
    }

bot.login(AuthDetails.email, AuthDetails.password);
