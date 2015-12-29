'use strict'
var Discord = require("discord.js");
var Config = require("./config.json");

var multiline = require("multiline");
var qs = require("querystring");

var bot = new Discord.Client();

bot.on("ready", function() {
	console.log("Started successfully. Serving in " + bot.servers.length + " servers");
});

bot.on("disconnected", function() {
	console.log(currentTime() + "Disconnected. Attempting to reconnect...");
	sleep(5000);
	bot.login(Config.email, Config.password);
});

bot.on("message", function(msg) {
	//Checks if the message is a command
	if (msg.content[0] === Config.prefix) {
		var command = msg.content.toLowerCase().split(" ")[0].substring(1);
		var suffix = msg.content.toLowerCase().substring(command.length + 2);
		var cmd = commands[command];
		if (cmd) {
			cmd.process(bot, msg, suffix);
		}
	}
});

var commands = {
	"8ball": {
		process: function(bot, msg, suffix) {
			if (suffix.length === 0) {
				bot.sendMessage(msg.channel, msg.author + " You call that a question?\nhttp://i.imgur.com/PcXHbt6.png");
			} else {
				var rand = Math.floor(Math.random() * EightBall.length);
				bot.sendMessage(msg.channel, msg.author + ":crystal_ball:**" + EightBall[rand] + "**:crystal_ball:");
			}
		}
	},
	"aide": {
		process: function(bot, msg, suffix) {
			if (suffix === "fun") {
				bot.sendMessage(msg.channel, aidefun);
			} else if (suffix === "utile") {
				bot.sendMessage(msg.channel, aideutile);
			} else if (suffix === "info") {
				bot.sendMessage(msg.channel, aideinfo);
			} else if (suffix === "jeux") {
				bot.sendMessage(msg.channel, aidejeux);
			} else if (suffix === "autres") {
				bot.sendMessage(msg.channel, helpother);
			} else {
				bot.sendMessage(msg.channel, aide);
			}
		}
	},
	"avatar": {
		process: function(bot, msg, suffix) {
			if (msg.mentions.length === 0) {
				if (msg.author.avatarURL === null) {
					bot.sendMessage(msg.channel, "You are naked.");
				} else {
					bot.sendMessage(msg.channel, "Your avatar:\n" + msg.author.avatarURL);
				}
				return;
			}
			var msgArray = [];
			for (var user of msg.mentions) {
				if (user.avatarURL === null) {
					msgArray.push(user.username + " is naked.");
				} else {
					msgArray.push(user.username + "'s avatar:\n" + user.avatarURL);
				}
			}
			bot.sendMessage(msg.channel, msgArray);
		}
	},
	"ayylmao": {
		process: function(bot, msg) {
			bot.sendMessage(msg.channel, "http://i.imgur.com/m7NaGVx.png");
			bot.sendFile(msg.channel, "./images/Ayylmao.png");
		}
	},
	"chat": {
		process: function(bot, msg, suffix) {
			var cb = msg.content.split(" ")[0].substring(1);
			var cbi = msg.content.substring(cb.length + 2);
			var cleverbot = require("cleverbot.io"),
				clever = new cleverbot(Config.cleverbot_api_name, Config.cleverbot_api_key);
			clever.setNick("Gravebot");
			clever.create(function(err, session) {
				clever.ask(cbi, function(err, response) {
					bot.sendMessage(msg.channel, response);
				});
			});
		}
	},
	"chillenmyb": {
		process: function(bot, msg) {
			bot.sendFile(msg.channel, "./images/Chillenmyb.jpg");
		}
	},
	"coin": {
		process: function(bot, msg) {
			var number = Math.floor(Math.random() * 2) + 1;
			if (number === 1) {
				bot.sendFile(msg.channel, "./images/Heads.png");
			} else {
				bot.sendFile(msg.channel, "./images/Tails.png");
			}
		}
	},
	"commands": {
		process: function(bot, msg) {
			bot.sendMessage(msg.channel, help);
		}
	},
	"decide": {
		process: function(bot, msg, suffix) {
			var split = suffix.split(" or ");
			var rand = Math.floor(Math.random() * Choices.length);
			if (split.length > 1) {
				bot.sendMessage(msg.channel, Choices[rand] + " **" + multipleDecide(split) + "**");
			} else {
				bot.sendMessage(msg.channel, "Usage: **`!decide`** `something` **`or`** `something...`");
			}

			function multipleDecide(options) {
				var selected = options[Math.floor(Math.random() * options.length)];
				if (selected === "") {
					return multipleDecide(options);
				} else {
					return selected;
				}
			}
		}
	},
	"drama": {
		process: function(bot, msg) {
			var rand = Math.floor(Math.random() * Drama.length);
			bot.sendMessage(msg.channel, Drama[rand]);
		}
	},
	"feelsgoodman": {
		process: function(bot, msg) {
			bot.sendFile(msg.channel, "./images/Feelsgoodman.png");
		}
	},
	"gif": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: **`!gif`** `gif tags`");
				return;
			}
			var tags = suffix.split(" ");
			get_gif(tags, function(id) {
				if (typeof id !== "undefined") {
					bot.sendMessage(msg.channel, "http://media.giphy.com/media/" + id + "/giphy.gif");
				} else {
					bot.sendMessage(msg.channel, "I couldn't find a gif for: " + tags);
				}
			});
		}
	},
	"help": {
		process: function(bot, msg, suffix) {
			if (suffix === "fun") {
				bot.sendMessage(msg.channel, helpfun);
			} else if (suffix === "useful") {
				bot.sendMessage(msg.channel, helpuseful);
			} else if (suffix === "info") {
				bot.sendMessage(msg.channel, helpinfo);
			} else if (suffix === "games") {
				bot.sendMessage(msg.channel, helpgames);
			} else if (suffix === "other") {
				bot.sendMessage(msg.channel, helpother);
			} else {
				bot.sendMessage(msg.channel, help);
			}
		}
	},
	"join": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: **`!join`** `invitation link`");
				return;
			}
			var invite = msg.content.split(" ")[1];
			bot.joinServer(invite, function(error, server) {
				if (error) {
					bot.sendMessage(msg.channel, "Failed to join: " + error);
				} else {
					bot.sendMessage(msg.channel, "Successfully joined " + server);
				}
			});
		}
	},
	"join-server": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: **`!join-server`** `invitation link`");
				return;
			}
			var invite = msg.content.split(" ")[1];
			bot.joinServer(invite, function(error, server) {
				if (error) {
					bot.sendMessage(msg.channel, "Failed to join: " + error);
				} else {
					bot.sendMessage(msg.channel, "Successfully joined " + server);
				}
			});
		}
	},
	"kappa": {
		process: function(bot, msg) {
			bot.sendFile(msg.channel, "./images/Kappa.png");
		}
	},
	"kappahd": {
		process: function(bot, msg) {
			bot.sendFile(msg.channel, "./images/Kappahd.png");
		}
	},
	"meme": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, 'Usage: **`!meme`** `meme name` `"top text"` `"bottom text"`\nWrite **`!memelist`** for a list of meme names.');
				return;
			}
			var tags = msg.content.split('"');
			var memetype = tags[0].split(" ")[1];
			var Imgflipper = require("imgflipper");
			var imgflipper = new Imgflipper(Config.imgflip_username, Config.imgflip_password);
			imgflipper.generateMeme(meme[memetype], tags[1] ? tags[1] : "", tags[3] ? tags[3] : "", function(err, image) {
				if (err) {
					bot.sendMessage(msg.channel, 'Usage: **`!meme`** `meme name` `"top text"` `"bottom text"`\nWrite **`!memelist`** for a list of meme names.');
				} else {
					bot.sendMessage(msg.channel, image);
				}
			});
		}
	},
	"memelist": {
		process: function(bot, msg, suffix) {
			if (suffix === "1") {
				bot.sendMessage(msg.author, memelist1);
			} else if (suffix === "2") {
				bot.sendMessage(msg.author, memelist2);
			} else if (suffix === "3") {
				bot.sendMessage(msg.author, memelist3);
			} else if (suffix === "full") {
				bot.sendMessage(msg.author, memelist1);
				bot.sendMessage(msg.author, memelist2);
				bot.sendMessage(msg.author, memelist3);
			} else {
				bot.sendMessage(msg.channel, memelist);
			}
		}
	},
	"quote": {
		process: function(bot, msg) {
			var rand = Math.floor(Math.random() * Quotes.length);
			bot.sendMessage(msg.channel, Quotes[rand]);
		}
	},
	"roll": {
		process: function(bot, msg, suffix) {
			var times = msg.content.split(" ")[1];
			var sides = msg.content.split(" ")[2];
			if (times > 500 && sides > 500) {
				bot.sendMessage(msg.channel, msg.author + " I'm too high to calculate that high number.");
			} else if (times > 900) {
				bot.sendMessage(msg.channel, msg.author + " I'm too high to calculate that high number.");
			} else {
				if (!sides) {
					sides = 6;
				}
				if (!times) {
					times = 1;
				}
				var msgArray = [];
				var number = 0;
				var total = 0;
				var average = 0;
				for (var i = times; i > 0; i--) {
					number = Math.floor(Math.random() * sides) + 1;
					total += number;
					average = total / times;
					msgArray.push(number);
				}
				if (isNaN(times) || isNaN(sides)) {
					bot.sendMessage(msg.channel, msg.author + " rolled " + suffix + "\nUsage: **`!roll`** `times` `sides`");
					return;
				} else {
					bot.sendMessage(msg.channel, msg.author + " rolled a " + sides + " sided dice " + times + " times for a total of " + total + " (average: " + average + "):\n" + msgArray);
				}
			}
		}
	},
	"serverinfo": {
		process: function(bot, msg) {
			var serverName = msg.channel.server.name;
			var serverID = msg.channel.server.id;
			var serverRegion = msg.channel.server.region;
			var serverOwner = msg.channel.server.owner.username;
			var channels = msg.channel.server.channels.length;
			var defaultChannel = msg.channel.server.defaultChannel.name;
			var members = msg.channel.server.members.length;
			var iconURL = msg.channel.server.iconURL;
			var serverinfo = ("```Server Name: " + serverName + "\nServer ID: " + serverID + "\nServer Region: " + serverRegion + "\nServer Owner: " + serverOwner + "\nChannels: " + channels + "\nDefault Channel: " + defaultChannel + "\nMembers: " + members + "\nServer Icon: " + iconURL + "```");
			bot.sendMessage(msg, serverinfo);
		}
	},
	"serverlist": {
		process: function(bot, msg) {
			var serversList = "";
			for (var server of bot.servers.sort()) {
				let online = 0;
				let member = "";
				serversList += "**`" + server + "`** " + server.members.length + " members (";
				online = server.members.reduce((count, member) => count + (member.status === 'online' ? 1 : 0), 0);
				serversList += online + " online)\n";
			}
			bot.sendMessage(msg.channel, serversList);
		}
	},
	"servers": {
		process: function(bot, msg) {
			bot.sendMessage(msg.channel, "Connected to " + bot.servers.length + " servers, " + bot.channels.length + " channels and " + bot.users.length + " users.");
		}
	},
	"skeltal": {
		process: function(bot, msg) {
			bot.sendMessage(msg.channel, "http://i.imgur.com/ZX79Q4S.png");
		}
	},
	"snoopify": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: **`!snoopify`** `sentence`");
				return;
			}
			var G = require('gizoogle');
			G.string(suffix, function(error, translation) {
				bot.sendMessage(msg.channel, translation);
			});
		}
	},
	"starwars4": {
		process: function(bot, msg) {
			bot.sendMessage(msg.channel, "http://i.imgur.com/l9VKWWF.png");
		}
	},
	"starwars5": {
		process: function(bot, msg) {
			bot.sendMessage(msg.channel, "http://i.imgur.com/eCpwo6J.png");
		}
	},
	"uptime": {
		process: function(bot, msg) {
			var uptimeh = Math.floor((bot.uptime / 1000) / (60 * 60));
			var uptimem = Math.floor((bot.uptime / 1000) % (60 * 60) / 60);
			var uptimes = Math.floor((bot.uptime / 1000) % 60);
			bot.sendMessage(msg.channel, "I have been alive for:\n" + uptimeh + " Hours\n" + uptimem + " Minutes\n" + uptimes + " Seconds\n");
		}
	},
	"urban": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: **`!urban`** `search terms`");
				return;
			}
			var Urban = require('urban');
			Urban(suffix).first(function(json) {
				if (json !== undefined) {
					var definition = "" + json.word + ": " + json.definition + "\n:arrow_up: " + json.thumbs_up + "   :arrow_down: " + json.thumbs_down + "\n\nExample: " + json.example;
					bot.sendMessage(msg.channel, definition);
				} else {
					bot.sendMessage(msg.channel, "I couldn't find a definition for: " + suffix);
				}
			});
		}
	},
	"userinfo": {
		process: function(bot, msg, suffix) {
			if (msg.mentions.length == 0) {
				var username = msg.author.username;
				var userID = msg.author.id;
				var discriminator = msg.author.discriminator;
				var status = msg.author.status;
				var avatar = msg.author.avatarURL;
				var userinfo = ("```Name: " + username + "\nID: " + userID + "\nDiscriminator: " + discriminator + "\nStatus: " + status + "\nAvatar: " + avatar + "```");
				bot.sendMessage(msg, userinfo);
			} else {
				for (var user of msg.mentions)
					if (user != null) {
						let info = [];
						var username = user.username;
						var userID = user.id;
						var discriminator = user.discriminator;
						var status = user.status;
						var avatar = user.avatarURL;
						var userinfo = ("```Name: " + username + "\nID: " + userID + "\nDiscriminator: " + discriminator + "\nStatus: " + status + "\nAvatar: " + avatar + "```");
						bot.sendMessage(msg, userinfo);
					}
			}
		}
	},
	"wiki": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: **`!wiki`** `search terms`");
				return;
			}
			var Wiki = require('wikijs');
			new Wiki().search(query, 1).then(function(data) {
				new Wiki().page(data.results[0]).then(function(page) {
					page.summary().then(function(summary) {
						var sumText = summary.toString().split('\n');
						var continuation = function() {
							var paragraph = sumText.shift();
							if (paragraph) {
								bot.sendMessage(msg.channel, paragraph, continuation);
							}
						};
						continuation();
					});
				});
			});
		}
	},
	"youtube": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: **`!youtube`** `video tags`");
				return;
			}
			var yt = require("./youtube_plugin");
			var youtube_plugin = new yt();
			youtube_plugin.respond(suffix, msg.channel, bot);
		}
	}
};

var help = multiline(function() {/*
**`!help fun`**
				List of fun commands
**`!help useful`**
				List of useful commands
**`!help info`**
				List of information commands
**`!help games`**
				List of game commands
**`!help other`**
				List of other commands
**`!aide`**
				Liste des commandes
**`!memelist`**
				List of meme names for the !meme command
*/});

var helpfun = multiline(function() {/*
**`!8ball`** `question`
				Answers the question
**`!chat`** `sentence`
				Chats with you
**`!coin`**
				Flips a coin
**`!decide`** `something` **`or`** `something...`
				Decides between given words
**`!drama`**
				Responds with a random drama image
**`!meme`** `meme name` `"top text"` `"bottom text"`
				Creates a meme with the given meme name and text
**`!quote`**
				Writes a random quote
**`!roll`** `times` `sides`
				Rolls the dice a number of times with a number of sides
**`!snoopify`** `sentence`
				Snoopifies tha sentence
*/});

var helpuseful = multiline(function() {/*
**`!gif`** `gif tags`
				Gets a gif from Giphy matching the given tags
**`!join`** `invitation link`
				Joins the server the bot is invited to
**`!urban`** `search terms`
				Returns the summary of the first matching search result from Urban Dictionary
**`!wiki`** `search terms`
				Returns the summary of the first matching search result from Wikipedia
**`!youtube`** `video tags`
				Gets a video from Youtube matching the given tags
*/});

var helpinfo = multiline(function() {/*
**`!avatar`** `@username`
				Responds with the Avatar of the user, if no user is written, your avatar
**`!serverinfo`**
				Gives information about the server
**`!serverlist`**
				Lists all the servers the bot is connected to
**`!servers`**
				Lists how many servers, channels and users the bot is connected to
**`!uptime`**
				Shows how long the bot has been online
**`!userinfo`** `@username`
				Gives information about the user, if no user is written, yourself
*/});

var helpgames = multiline(function() {/*
**`Coming Soon`**:tm:
*/});

var helpother = multiline(function() {/*
**`!ayylmao`**
**`!chillenmyb`**
**`!feelsgoodman`**
**`!kappa`**
**`!kappaHD`**
**`!skeltal`**
**`!starwars4`**
**`!starwars5`**
*/});

var aide = multiline(function() {/*
**`!aide fun`**
				Liste de commandes amusantes
**`!aide utile`**
				Liste de commandes utiles
**`!aide info`**
				Liste de commandes d'information
**`!aide jeux`**
				Liste des commandes de jeux
**`!aide autres`**
				Liste des autres commandes
**`!help`**
				List of commands
**`!memelist`**
				Liste des "meme" pour la commande !meme
*/});

var aidefun = multiline(function() {/*
**`!8ball`** `question`
				Répond à la question
**`!chat`** `phrase`
				Discute avec toi
**`!coin`**
				Lance une pièce
**`!decide`** `quelque chose` **`or`** `quelque chose...`
				Choisissez entre les mots donnés
**`!drama`**
				Renvoi une image dramatique aléatoire
**`!meme`** `noms du meme` `"texte haut"` `"texte bas"`
				Crée un « meme » avec le texte choisis
**`!quote`**
				Ecrit une citation aléatoire
**`!roll`** `fois` `côtés`
				Fait rouler un certain nombre de fois un dé avec un nombre de faces
**`!snoopify`** `phrase`
				Snoopifies la phrase
*/});

var aideutile = multiline(function() {/*
**`!gif`** `tags du gifs`
				Retourne un gif correspondant aux tags
**`!join`** `lien d'invitation`
				Rejoint le serveur auquel le bot est invité
**`!urban`** `mots de la recherche`
				Retourne la première définition de Urban Dictionary correspondant aux tags
**`!wiki`** `mots de la recherche`
				Retourne un résumé de la page Wikipedia correspondant aux tags
**`!youtube`** `tags de la vidéo`
				Retourne la vidéo youtube correspondant aux tags
*/});

var aideinfo = multiline(function() {/*
**`!avatar`** `@username`
				Retourne l'avatar de l'utilisateur, si aucun noms d'utilisateur est spécifié, votre avatar
**`!serverinfo`**
				Donne les infos du serveur
**`!serverlist`**
				Liste tous les serveurs auquel le bot est connecté
**`!servers`**
				Liste le nombre de serveurs, canaux et utilisateurs auquels le bots est connecté
**`!uptime`**
				Affiche la durée du bot en ligne
**`!userinfo`** `@username`
				Donne des informations à propose de l'utilisateur
*/});

var aidejeux = multiline(function() {/*
**`Coming Soon`**:tm:
*/});

var memelist = multiline(function() {/*
Meme names for the !meme command
**`!memelist 1`**
**`!memelist 2`**
**`!memelist 3`**
**`!memelist full`**
*/});

var memelist1 = multiline(function() {/*
	**`aliens`** - Ancient Aliens :alien:
	**`allthese`** - Look at all these
	**`allthings`** - All the things
	**`approved`** - Chuck Norris approves :thumbsup:
	**`archaic`** - Joseph Ducreux
	**`archer`** - Archer
	**`bender`** - Blackjack and Hookers
	**`both`** - Why not both :question:
	**`brace`** - Brace yourselves, ... is coming
	**`cares`** - No one cares m8
	**`cat`** - Grumpy Cat :cat:
	**`cat2`** - Sophisticated cat :cat:
	**`chainsaw`** - Chainsaw Bear :bear:
	**`challenge`** - Challenge accepted
	**`cheers`** - Leonardo Dicaprio cheers :smiley:
	**`childhood`** - Right in the childhood :dizzy_face:
	**`chilling`** - What's up :question:
	**`christ`** - Buddy Christ :pray:
	**`clarity`** - Sudden clarity Clarence :frowning:
	**`cold`** - Jack Nicholson inside snow :snowman:
	**`confession`** - Confession bear :bear:
	**`conspiracy`** - Keanu Reeves conspiracy :frowning:
	**`consuela`** - Not amused :unamused:
	**`cows`** - Evil cows :cow:
	**`djpauly`** - DJ Pauly
	**`doge`** - Such wow Much meme
	**`doges`** - Suchs wows muchs memes
	**`drama`** - Michael Jackson popcorn
	**`drevil`** - Dr Evil quotes
	**`elf`** - Buddy the Elf
	**`everywhere`** - ..., ... everywhere
	**`explosion`** - Nuclear explosion :boom:
	**`frustrated`** - Frustrated Boromir
	**`fry`** - Not sure if ... or ... :confused:
	**`fry2`** - Shut up and take my money
	**`giveup`** - Just give up m8
	**`gone`** - Aaand it's gone
	**`goodday`** - Today was a good day
	**`goodguy`** - Good guy Greg :smile:
	**`hide`** - Hide yo kids hide yo wife
	**`highguy`** - High Guy
	**`hot`** - So hot :hotsprings:
	**`idontalways`** - I don't always ... but when I do ...
	**`impossibru`** - Imbossibru! :grimacing:
	**`internet`** - Internet Guide
	**`internet2`** - Welcome to the internet :sweat_drops:
*/});

var memelist2 = multiline(function() {/*
	**`johnny`** - Here's Johnny
	**`joker`** - And everybody loses their minds
	**`karate`** - Karate Kyle
	**`keepcalm`** -- Keep calm and ...
	**`kermit`** - But that's none of my business
	**`koala`** - Surprised Koala :koala:
	**`laugh`** - Leonardo Dicaprio laughs :laughing:
	**`lebowski`** - Confused Lebowski :confused:
	**`limes`** - Why can't I hold all these limes
	**`lionking`** - Lion King :tiger: :crown:
	**`lol`** - L0L
	**`look`** - Look at me :eyes:
	**`luck`** - Bad luck Bryan
	**`luke`** - Luke, I am ...
	**`mallard`** - Actual advice Mallard
	**`money`** - The Mask :dollar:
	**`more`** - Y'all got any more of that ...
	**`morpheus`** - What if I told you :pill:
	**`mrbean`** - If you know what I mean :smirk:
	**`mrt`** - Mr. T
	**`nappa`** - No Nappa it's a trick
	**`news`** - Peter Griffin news
	**`news2`** - Ron Burgundy news
	**`notbad`** - Not bad
	**`noty`** - Kill yourself :skull:
	**`obiwan`** - Obi Wan Kenobi
	**`onedoesnot`** - One does not simply
	**`onlyone`** - Am I the only one around here :gun:
	**`ouch`** - Don't worry I'm fine
	**`paddlin`** - That's a paddlin'
	**`past`** - Back in my day :older_man:
	**`past2`** - Back in my day :older_man:
	**`patrick`** - Take ... and put it somewhere else
	**`patrick2`** - Once upon a time
	**`penguin`** - Socially awesome awkward penguin :penguin:
	**`penguin2`** - Penguin Gang :penguin:
	**`phone`** - Liam Neeson Taken :worried:
	**`picard`** - Captain Picard facepalm :neutral_face: :hand:
	**`picard2`** - Captain Picard WTF :question:
	**`please`** - Yao Ming :joy:
	**`powers`** - Austin Powers :smirk:
	**`powers2`** - Seriously :question:
	**`problems`** - First world problems :cry:
	**`problems2`** - 90s first world problems :cry:
	**`puffin`** - Unpopular opinion Puffin :bird:
	**`rpg`** - RPG fan
*/});

var memelist3 = multiline(function() {/*
	**`rum`** - Why is the rum gone :question:
	**`say`** - Say that one more time, I dare you
	**`scumbag`** - Scumbag Steve
	**`seal`** - Awkward seal :neutral_face:
	**`seal2`** - Satisfied seal :smirk:
	**`seriously`** - Are you kidding me :question:
	**`skeleton`** - Skeleton on a bench :skull:
	**`skeptical`** - Skeptical kid
	**`sorry`** - Rick and Carl :cry:
	**`sparrow`** - Jack Sparrow being chased
	**`sparta`** - This is sparta!
	**`spiderman`** - Peter Parker
	**`spidermanbed`** - Spiderman bed
	**`spidermancamera`** - Spiderman camera :camera:
	**`spidermandesk`** - Spiderman desk
	**`spidermanmoney`** - Spiderman money :dollar:
	**`spidermanrails`** - Spiderman rails
	**`spidermansad`** - Spiderman sad :frowning:
	**`spongebob`** - Didn't you ...
	**`spongebob2`** - Imagination :rainbow:
	**`spongebob3`** - I'll have you know
	**`squidward`** - Beautiful :vs: Ugly
	**`success`** - Success kid
	**`sucks`** - Life sucks
	**`tableflip`** - /tableflip
	**`teacher`** - Unhelpful high school teacher
	**`teacher2`** - Rasta teacher
	**`ted`** - TED :confused:
	**`time`** - Ain't nobody got time for that :clock2:
	**`told`** - I was told there would be
	**`toohigh`** - Is too damn high :chart_with_upwards_trend:
	**`trophy`** - This is where I'd put my ... if I had one :trophy:
	**`truestory`** - True story
	**`unicorn`** - Unicorn Man
	**`wat`** - Wat :question:
	**`wait`** - I'll just wait here
	**`whoa`** - Neil deGrasse Tyson
	**`win`** - Barney Stanson win :thumbsup:
	**`wonka`** - Willy Wonka stares :eyes:
	**`wtf`** - Jackie Chan WTF :question:
	**`wth`** - Kevin Hart WTH :question:
	**`yeah`** - That would be great
	**`yoda`** - Yoda is I
	**`yo dawg`** - Yo Dawg
	**`yuno`** - Y U No
	**`zoidberg`** - You should feel bad
	**`404`** - :warning: Not Found :warning:
	**`?`** - :warning: :tm: :warning:
*/});

//If you want to add more memes, go to https://imgflip.com/memetemplates click on the wanted meme and click Blank Template on the right, then just copy the ID and name it
var meme = {
	"onedoesnot": 61579,
	"idontalways": 61532,
	"aliens": 101470,
	"fry": 61520,
	"everywhere": 347390,
	"cheers": 5496396,
	"problems": 61539,
	"brace": 61546,
	"yuno": 61527,
	"kermit": 16464531,
	"luck": 61585,
	"wonka": 61582,
	"yeah": 563423,
	"cat": 405658,
	"skeptical": 101288,
	"doge": 8072285,
	"morpheus": 100947,
	"allthings": 61533,
	"picard": 1509839,
	"picard2": 245898,
	"onlyone": 259680,
	"wat": 14230520,
	"drevil": 40945639,
	"toohigh": 61580,
	"success": 101287,
	"time": 442575,
	"confession": 100955,
	"wait": 109765,
	"say": 124212,
	"highguy": 101440,
	"yodawg": 101716,
	"spongebob": 101511,
	"seal": 13757816,
	"sparta": 195389,
	"joker": 1790995,
	"conspiracy": 61583,
	"gone": 766986,
	"past": 718432,
	"hot": 21604248,
	"patrick": 61581,
	"scumbag": 61522,
	"noty": 172314,
	"cat2": 1367068,
	"skeleton": 4087833,
	"more": 13424299,
	"phone": 228024,
	"yoda": 14371066,
	"archer": 10628640,
	"spidermandesk": 1366993,
	"cares": 6531067,
	"past2": 1232104,
	"christ": 17699,
	"penguin": 61584,
	"spongebob2": 163573,
	"laugh": 17496002,
	"clarity": 100948,
	"wtf": 412211,
	"obiwan": 409403,
	"news": 356615,
	"sorry": 11557802,
	"seal2": 23909796,
	"wth": 265789,
	"fry2": 176908,
	"powers": 646581,
	"puffin": 7761261,
	"koala": 27920,
	"luke": 19194965,
	"news2": 1232147,
	"spiderman": 107773,
	"sparrow": 460541,
	"look": 30213495,
	"djpauly": 2005809,
	"mrt": 1570716,
	"goodguy": 61521,
	"allthese": 516587,
	"unicorn": 138874,
	"lionking": 206153,
	"spongebob3": 326093,
	"impossibru": 307405,
	"frustrated": 320771,
	"trophy": 3218037,
	"ted": 131092,
	"mallard": 1356640,
	"elf": 401687,
	"problems2": 101296,
	"zoidberg": 35747,
	"teacher": 100957,
	"please": 109015,
	"archaic": 61535,
	"drama": 16350739,
	"whoa": 109017,
	"told": 2372682,
	"consuela": 160583,
	"johnny": 309172,
	"spidermanbed": 152145,
	"money": 828786,
	"tableflip": 1380694,
	"approved": 241304,
	"goodday": 7722308,
	"paddlin": 5265532,
	"bender": 59250,
	"hide": 750310,
	"internet2": 701902,
	"giveup": 156115,
	"cold": 9106691,
	"explosion": 313162,
	"karate": 61561,
	"squidward": 285870,
	"chainsaw": 136212,
	"keepcalm": 22415053,
	"internet": 406070,
	"challenge": 24792,
	"mrbean": 583373,
	"truestory": 335860,
	"rum": 752040,
	"cows": 107043,
	"childhood": 177491,
	"spidermanrails": 413621,
	"rpg": 309184,
	"win": 690206,
	"both": 542036,
	"patrick2": 465748,
	"powers2": 26468627,
	"spidermansad": 412764,
	"limes": 5824468,
	"404": 241795,
	"chilling": 220847,
	"notbad": 289182,
	"lebowski": 1195347,
	"penguin2": 274504,
	"spidermancamera": 1045989,
	"lol": 105398,
	"teacher2": 61566,
	"seriously": 412219,
	"spidermanmoney": 191950,
	"nappa": 295701,
	"ouch": 129430,
	"sucks": 201950,
	"doges": 7665301,
	"?": 1139584,
};

var EightBall = [
	"It is certain",
	"My CPU is saying yes",
	"Without a doubt",
	"Yes, definitely",
	"Yes, unless you run out of memes",
	"As I see it, yes",
	"Most likely",
	"If you say so",
	"Sure, sure",
	"Signs point to yes",
	"You can't handle the truth",
	"When life gives you rice, you make rice",
	"Better not tell you now",
	"Cannot predict now",
	"Out of psychic coverage range",
	"Don't count on it",
	"My CPU is saying no",
	"In your dreams",
	"You are doomed",
	"Very doubtful",
	"私はあなたのお母さんを翻訳しました",
	"Wow, Much no, very yes, so maybe"
];

var Choices = [
	"I have decided upon",
	"I would choose",
	"In my opinion, it's",
	"I'd go with",
	"My final decision is",
	"You're better off with",
	"It's absolutely",
	"Definitely",
	"The answer is"
];

var Quotes = [
	"Going to church doesn’t make you a Christian any more than standing in a garage makes you a car. - *Billy Sunday*",
	"I dream of a better tomorrow, where chickens can cross the road and not be questioned about their motives.",
	"I hate when old people poke you at a wedding and say you're next. So when I was at a funeral I poked them and said you're next.",
	"I think the worst time to have a heart attack is during a game of charades. - *Demetri Martin*",
	"I asked God for a bike, but I know God doesn’t work that way. So I stole a bike and asked for forgiveness. - *Emo Philips*",
	"The only mystery in life is why the kamikaze pilots wore helmets. - *Al McGuire*",
	"How is it one careless match can start a forest fire, but it takes a whole box to start a campfire?",
	"I couldn’t repair your brakes, so I made your horn louder. - *Steven Wright*",
	"I intend to live forever. So far, so good. - *Steven Wright*",
	"I dream of a better tomorrow, where chickens can cross the road and not be questioned about their motives.",
	"When tempted to fight fire with fire, remember that the Fire Department usually uses water.",
	"My favorite machine at the gym is the vending machine.",
	"I always arrive late at the office, but I make up for it by leaving early. - *Charles Lamb*",
	"Just do it. - *Shia Labeouf*",
	"Don't let your dreams be memes. - *Shia LaBeouf*",
	"Jet fuel can't melt steel beams. - *Barack Obama*",
	"Jet fuel can't melt steel memes. - *Barack Obama*",
	"Born too late to explore the earth\nBorn too soon to explore the galaxy\nBorn just in time to **browse dank memes**",
	"Feels good man. - *Pepe*",
	"Press F to pay respects.",
	"We don't make mistakes, just happy little accidents. - *Bob Ross*",
	"There's nothing wrong with having a tree as a friend. - *Bob Ross*",
	"The only thing worse than yellow snow is green snow. - *Bob Ross*",
	"Shwooop. Hehe. You have to make those little noises, or it just doesn't work. - *Bob Ross*",
	"I like to beat the brush. - *Bob Ross*",
	"Just tap it. - *Bob Ross*",
	"That'll be our little secret. - *Bob Ross*"
];

var Drama = [
  "http://i.imgur.com/IwJnS7s.png",
	"http://i.imgur.com/2QBVNEy.png",
	"http://i.imgur.com/Vflx6FT.png",
	"http://i.imgur.com/GbIaoT0.png",
	"http://i.imgur.com/H3NmH9A.png",
	"http://i.imgur.com/mF0tsPR.png",
	"http://i.imgur.com/lSsR6sD.png",
	"http://i.imgur.com/PSi8gtA.png",
	"http://i.imgur.com/iMJOWmk.png",
	"http://i.imgur.com/tx0RTpO.png",
	"http://i.imgur.com/7qQ1WXA.png",
	"http://i.imgur.com/373kW4w.png",
	"http://i.imgur.com/hIFLJlG.png",
	"http://i.imgur.com/80bF923.png",
	"http://i.imgur.com/0nBAsqC.png",
	"http://i.imgur.com/KKVHZTt.png",
	"http://i.imgur.com/DdnIFi2.png",
	"http://i.imgur.com/OX2r7f3.png",
	"http://i.imgur.com/NdyVfGj.png",
	"http://i.imgur.com/5eJXar4.png",
	"http://i.imgur.com/qP9Mbm2.png",
	"http://i.imgur.com/E6Fkk97.png",
	"http://i.imgur.com/BIJdWtz.png",
	"http://i.imgur.com/rRAKiSv.png",
	"http://i.imgur.com/lj1UGpj.png",
	"http://i.imgur.com/jqr2gUM.png"
];

function get_gif(tags, func) {
	//limit=1 will only return 1 gif
	var params = {
		"api_key": "dc6zaTOxFJmzC",
		"rating": "r",
		"format": "json",
		"limit": 1
	};
	var query = qs.stringify(params);
	if (tags !== null) {
		query += "&q=" + tags.join('+')
	}

	var request = require("request");

	request("http://api.giphy.com/v1/gifs/search" + "?" + query, function(error, response, body) {
		var responseObj = JSON.parse(body)
		if (responseObj.data.length) {
			func(responseObj.data[0].id);
		} else {
			func(undefined);
		}
	}.bind(this));
}

bot.login(Config.email, Config.password);
