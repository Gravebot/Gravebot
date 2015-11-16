var Discord = require("discord.js");
var Config = require("./config.json");

var multiline = require("multiline");
var qs = require("querystring");

var bot = new Discord.Client();

bot.on("ready", function() {
	console.log("Ready to begin! Serving in " + bot.servers.length + " servers");
	//Sets the game the bot will be shown as playing, change the number for a different game
	bot.setPlayingGame(329);
});

bot.on("disconnected", function() {
	console.log(currentTime() + "Disconnected. Attempting to reconnect...");
	sleep(5000);
	bot.login(Config.email, Config.password);
});

bot.on("message", function(msg) {
	//Checks if the message is a command
	if (msg.content[0] === '!') {
		var command = msg.content.toLowerCase().split(" ")[0].substring(1);
		var suffix = msg.content.toLowerCase().substring(command.length + 2);
		var cmd = commands[command];
		if (cmd) {
			cmd.process(bot, msg, suffix);
		}
	}

	if (msg.content.toLowerCase().indexOf("gravebot") != -1 || msg.isMentioned(bot.user)) {
		bot.sendMessage(msg.author, "I am a bot that is owned by **Gravestorm** and hosted 24/7.\nIf you want to see my guts, click the link below:\nhttps://github.com/Gravestorm/Gravebot");
	}
});

var commands = {
	"8ball": {
		process: function(bot, msg, suffix) {
			if (suffix.length === 0) {
				bot.sendMessage(msg.channel, msg.sender + " You call that a question?\nhttp://i.imgur.com/PcXHbt6.png");
			} else {
				var rand = Math.floor(Math.random() * EightBall.length);
				bot.sendMessage(msg.channel, msg.sender + ":crystal_ball:**" + EightBall[rand] + "**:crystal_ball:");
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
			} else {
				bot.sendMessage(msg.channel, aide);
			}
		}
	},
	"avatar": {
		process: function(bot, msg, suffix) {
			if (msg.mentions.length === 0) {
				bot.sendMessage(msg.channel, "Your avatar:\n" + msg.sender.avatarURL);
				return;
			}
			var msgArray = [];
			for (index in msg.mentions) {
				var user = msg.mentions[index];
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
		process: function(bot, msg) {
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
				bot.sendMessage(msg.channel, "Usage: !decide *something* **or** *something* **or** *something*...");
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
	"gif": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: !gif **gif tags**");
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
			} else {
				bot.sendMessage(msg.channel, help);
			}
		}
	},
	"image": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: !image **image tags**");
				return;
			}
			var gi = require("./google_image_plugin");
			var google_image_plugin = new gi();
			google_image_plugin.respond(suffix, msg.channel, bot);
		}
	},
	"join-server": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: !join-server **invitation link**");
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
	"meme": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, 'Usage: !meme **meme name** **"top text"** **"bottom text"**');
				return;
			}
			var tags = msg.content.split('"');
			var memetype = tags[0].split(" ")[1];
			var Imgflipper = require("imgflipper");
			var imgflipper = new Imgflipper(Config.imgflip_username, Config.imgflip_password);
			imgflipper.generateMeme(meme[memetype], tags[1] ? tags[1] : "", tags[3] ? tags[3] : "", function(err, image) {
				if (err) {
					bot.sendMessage(msg.channel, 'Usage: !meme **meme name** **"top text"** **"bottom text"**');
				} else {
					bot.sendMessage(msg.channel, image);
				}
			});
		}
	},
	"memelist": {
		process: function(bot, msg) {
			bot.sendMessage(msg.channel, memelist);
		}
	},
	"myid": {
		process: function(bot, msg) {
			bot.sendMessage(msg.channel, msg.author.id);
		}
	},
	"quote": {
		process: function(bot, msg) {
			var rand = Math.floor(Math.random() * Quotes.length);
			bot.sendMessage(msg.channel, Quotes[rand]);
		}
	},
	"rick": {
		process: function(bot, msg, suffix) {
			var first = msg.content.split(" ")[1];
			if (first) {
				var numbers = Math.floor(Math.random() * first) + 1;
			} else {
				var numbers = Math.floor(Math.random() * 6969) + 1;
			}
			var second = msg.content.split(" ")[2];
			if (second) {
				var count = Math.floor(Math.random() * second) + 1;
			} else {
				var count = Math.floor(Math.random() * 9696) + 1;
			}
			bot.sendMessage(msg.channel, msg.sender + " Ricked " + numbers);
			bot.sendMessage(msg.author, "```You got Rick Rolled " + count + " times.```\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ\nhttp://i.imgur.com/wyLF0TN.png");
		}
	},
	"roll": {
		process: function(bot, msg, suffix) {
			if (suffix) {
				var number = Math.floor(Math.random() * suffix) + 1;
			} else {
				var number = Math.floor(Math.random() * 6) + 1;
			}
			bot.sendMessage(msg.channel, msg.sender + " Rolled " + number);
		}
	},
	"servers": {
		process: function(bot, msg) {
			var list = bot.servers.sort();
			bot.sendMessage(msg.channel, list);
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
				bot.sendMessage(msg.channel, "Usage: !urban **search terms**");
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
	"wiki": {
		process: function(bot, msg, suffix) {
			var query = suffix;
			if (!query) {
				bot.sendMessage(msg.channel, "Usage: !wiki **search terms**");
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
				bot.sendMessage(msg.channel, "Usage: !youtube **video tags**");
				return;
			}
			var yt = require("./youtube_plugin");
			var youtube_plugin = new yt();
			youtube_plugin.respond(suffix, msg.channel, bot);
		}
	}
};

var help = multiline(function() {/*
```cs
!help fun
      List of fun commands

!help useful
      List of useful commands

!help info
      List of information commands

!aide
      Liste des commandes

!memelist
      List of meme names for the !meme command
```
*/});

var helpfun = multiline(function() {/*
```cs
!8ball 'question'
      Answers the question

!chat 'sentence'
      Chats with you

!decide 'something or something or something...'
      Decides between given words

!meme 'meme name "top text" "bottom text"'
      Creates a meme with the given meme name and text

!quote
      Writes a random quote

!rick 'number' 'ricks'
      Ricks the dice with a number of sides, if no number is written, six-sided

!roll 'number'
      Rolls the dice with a number of sides, if no number is written, six-sided
```
*/});

var helpuseful = multiline(function() {/*
```cs
!avatar '@Username'
      Responds with the Avatar of the user, if no user is written, the avatar of the sender

!gif 'gif tags'
      Gets a gif from Giphy matching the given tags

!image 'image tags'
      Gets an image from Google matching the given tags

!join-server 'invitation link'
      Joins the server the bot is invited to

!urban 'search terms'
      Returns the summary of the first matching search result from Urban Dictionary

!wiki 'search terms'
      Returns the summary of the first matching search result from Wikipedia

!youtube 'video tags'
      Gets a video from Youtube matching the given tags
```
*/});

var helpinfo = multiline(function() {/*
```cs
!ayylmao
      All dayy lmao

!kappa
      Kappa

!myid
      Responds with the user ID of the sender

!servers
      Lists all the servers the bot is connected to

!uptime
      Shows how long the bot has been online
```
*/});

var aide = multiline(function() {/*
```
!aide fun
      Liste de commandes amusantes

!aide utile
      Liste de commandes utiles

!aide info
      Liste de commandes d'information

!help
      List of commands

!memelist
      Liste des "meme" pour la commande !meme
```
*/});

var aidefun = multiline(function() {/*
```
!8ball *question*
      Répond à la question

!chat *phrase*
      Discute avec toi

!decide *quelque chose ou quelque chose ou quelque chose...*
      Choisissez entre les mots donnés

!meme *noms du meme "texte haut" "texte bas"*
      Crée un « meme » avec le texte choisis

!quote
      Ecrit une citation aléatoire

!rick *chiffre* *ricks*
      Ricks les dés

!roll *chiffre*
      Fait rouler les dés
```
*/});

var aideutile = multiline(function() {/*
```
!avatar *@Username*
      Retourne l'avatar de l'utilisateur, si aucun noms d'utilisateur est spécifié, retourne celui par défaut

!gif *tags du gifs*
      Retourne un gif correspondant aux tags

!image *tags de l'image*
      Retourne une image correspondant aux tags

!join-server *lien d'invitation*
      Rejoint le serveur auquel le bot est invité

!urban *mots de la recherche*
      Retourne la première définition de Urban Dictionary correspondant aux tags

!wiki *mots de la recherche*
      Retourne un résumé de la page Wikipedia correspondant aux tags

!youtube *tags de la vidéo*
      Retourne la vidéo youtube correspondant aux tags
```
*/});

var aideinfo = multiline(function() {/*
```
!ayylmao
      All dayy lmao

!kappa
      Kappa

!myid
      Retourne l’ID de l’utilisateur

!servers
      Liste tous les serveurs auquel le bot est connecté

!uptime
      Affiche la durée du bot en ligne
```
*/});

var memelist = multiline(function() {/*
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
