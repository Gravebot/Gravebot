var Discord = require("discord.js");
var multiline = require("multiline");

var yt = require("./youtube_plugin");
var youtube_plugin = new yt();

var gi = require("./google_image_plugin");
var google_image_plugin = new gi();

var AuthDetails = require("./auth.json");
var qs = require("querystring");

var htmlToText = require('html-to-text');

var config = {
    "api_key": "dc6zaTOxFJmzC",
    "rating": "r",
    "url": "http://api.giphy.com/v1/gifs/search",
    "permission": ["NORMAL"]
};

//If you want to add more memes, go to https://api.imgflip.com/popular_meme_ids
var meme = {
	"brace": 61546,
	"mostinteresting": 61532,
	"fry": 61520,
	"onedoesnot": 61579,
	"yuno": 61527,
	"success": 61544,
	"allthethings": 61533,
	"doge": 8072285,
	"drevil": 40945639,
	"skeptical": 101711,
	"notime": 442575,
	"yodawg": 101716
};

var help = multiline(function(){/*
```!avatar
     Responds with the Avatar image of the sender

!ayylmao
     All dayy lmao

!gif <gif tags>
     Gets a gif from Giphy matching the given tags

!image <image tags>
     Gets an image from Google matching the given tags

!join-server <invite>
     Joins the server the bot is invited to

!kappa
     Kappa

!meme <meme name> "top text" "bottom text"
     Creates a meme with the given meme name and text

!memehelp
     Lists available meme names

!myid
     Responds with the user ID of the sender

!roll
     Rolls the dice

!servers
     Lists all the servers the bot is connected to

!urban <search terms>
     Returns the summary of the first matching search result from Urban Dictionary

!uptime
     Shows how long the bot has been online

!wiki <search terms>
     Returns the summary of the first matching search result from Wikipedia

!youtube <video tags>
     Gets a video from Youtube matching the given tags```
*/});

var commands = {
    "avatar": {
      description: "Responds with the Avatar image of the sender",
      process: function(bot, msg){bot.sendMessage(msg.channel, msg.sender.avatarURL);}
    },
    "ayylmao": {
      description: "All dayy lmao",
      process: function(bot, msg){bot.sendFile(msg.channel, "./images/Ayylmao.png");}
    },
    "commands": {
        description: "Lists all commands",
        process: function(bot, msg) {bot.sendMessage(msg.channel, help);}
    },
    "gif": {
	       usage: "<gif tags>",
         description: "Gets a gif from Giphy matching the given tags",
         process: function(bot, msg, suffix) {
           var query = suffix;
           if(!query) {
               bot.sendMessage(msg.channel, "Usage: !gif <gif tags>");
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
        description: "Lists all commands",
        process: function(bot, msg) {bot.sendMessage(msg.channel, help);}
    },
    "image": {
        usage: "<image tags>",
        description: "Gets an image from Google matching the given tags",
        process: function(bot, msg, suffix){
          var query = suffix;
          if(!query) {
              bot.sendMessage(msg.channel, "Usage: !image <image tags>");
              return;
          }
          google_image_plugin.respond(suffix, msg.channel, bot);}
    },
    "join-server": {
        usage: "<invite>",
        description: "Joins the server the bot is invited to",
        process: function(bot, msg, suffix) {
          var query = suffix;
          if(!query) {
              bot.sendMessage(msg.channel, "Usage: !join-server <invite>");
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
      description: "Kappa",
      process: function(bot, msg){bot.sendFile(msg.channel, "./images/Kappa.png");}
    },
    "meme": {
        usage: '<meme name> <"top text"> <"bottom text">',
        description: "Creates a meme with the given meme name and text",
            process: function(bot, msg, suffix) {
              var query = suffix;
              if(!query) {
                  bot.sendMessage(msg.channel, 'Usage: !meme <meme name> <"top text"> <"bottom text">');
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
        description: "Lists available meme names",
        process: function(bot, msg) {
            var str = "Currently available memes:\n"
            for (var m in meme){
                str += m + "\n"
        }
        bot.sendMessage(msg.channel, str);
      }
    },
    "myid": {
        description: "Responds with the user ID of the sender",
        process: function(bot, msg){bot.sendMessage(msg.channel, msg.author.id);}
    },
    "roll": {
    description: "Rolls the dice",
    process: function(bot, msg, suffix) {
        var number = Math.floor(Math.random() * 6) + 1;
        bot.sendMessage(msg.channel, msg.sender + " Rolled " + number);
      }
    },
    "servers": {
        description: "Lists all the servers the bot is connected to",
        process: function(bot, msg){bot.sendMessage(msg.channel, bot.servers);}
    },
    "uptime": {
        description: "Shows how long the bot has been online",
        process: function(bot, msg){
          var uptimeh = Math.floor((bot.uptime / 1000) / (60*60));
          var uptimem = Math.floor((bot.uptime / 1000) % (60*60) / 60);
          var uptimes = Math.floor((bot.uptime / 1000) % 60);
          bot.sendMessage(msg.channel, "I have been alive for:\n" + uptimeh + " Hours\n" + uptimem + " Minutes\n" + uptimes + " Seconds\n");
      }
    },
    "urban": {
        usage: "<search terms>",
        description: "Returns the summary of the first matching search result from Urban Dictionary",
        process: function(bot, msg, suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel, "Usage: !urban <search terms>");
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
        usage: "<search terms>",
        description: "Returns the summary of the first matching search result from Wikipedia",
        process: function(bot, msg, suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel, "Usage: !wiki <search terms>");
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
        usage: "<video tags>",
        description: "Gets a video from Youtube matching the given tags",
        process: function(bot, msg, suffix){
          var query = suffix;
          if(!query) {
              bot.sendMessage(msg.channel, "Usage: !youtube <video tags>");
              return;
          }
          youtube_plugin.respond(suffix, msg.channel, bot);}
    },
};

var bot = new Discord.Client();

bot.on("ready", function () {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
  //Uncomment and insert a number to set the game your bot will be playing
  //bot.setPlayingGame(329);
});

bot.on("disconnected", function () {
    console.log(currentTime() + "Disconnected. Attempting to reconnect...");
    sleep(5000);
    bot.login(AuthDetails.email, AuthDetails.password);
});

bot.on("message", function (msg) {
	//Checks if the message is a command
	if(msg.author.id != bot.user.id && msg.content[0] === '!') {
		  var cmdTxt = msg.content.split(" ")[0].substring(1);
      var suffix = msg.content.substring(cmdTxt.length+2);
		  var cmd = commands[cmdTxt];
      if(cmd) {
    cmd.process(bot, msg, suffix);
		} else {
			bot.sendMessage(msg.channel, "Invalid command " + cmdTxt);
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
