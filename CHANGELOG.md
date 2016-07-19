<a name="3.1.0" />
## 3.1.0 (July 19th, 2016)

### Features
- `!ddg` Search the web with DuckDuckGo
- `!feedback` Leave feedback about the bot
- `!feelsbadman` Because not everything is good
- `!ow` Overwatch commands
- `!random` Commands for generating some truly random numbers and strings
- `!robohash` Get your personal robot and monster image

### Bug Fixes
- Ignore casing for meme names
- The suffix for `!leet` and `!snoop` is lowercased, as uppercase was being ignored

### Technical Features
- Added datadog metric tracking
- Renamed envs `YOUTUBE_API_KEY` to `YOUTUBE_KEY` and `CHAMPIONGG_API` to `CHAMPIONGG_KEY`
- Split up `info.js` into its own folder


<a name="3.0.0" />
## 3.0.0 (April 22nd, 2016)

#### Breaking Changes
- Gravebot no longer works with regular accounts (email and password). Instead a bot account is required (token and client_id). See https://discordapp.com/developers/applications/me

#### Features
- `!animals` command to see all the adorable animal pictures you can show off
- `!leet` lets you talk like a real hacker... If that's what you consider a hacker.
- `!ping` lets you know Gravebot is alive and well
- `!channelinfo` gives details on the current channel
- `!serverinfo` now lets you get server info about other servers if you know the name
- `!unshorten` gives you the security of unshrinking a shortened link and avoiding your friends terrible troll attempts

#### Bug Fixes
- Various bugs with `!help` and language commands
- `!avatar` and `!userinfo` work without having to mention a user
- Fixed default values for `!roll`
- Fixed users not getting PMs with commands like `!memelist`

#### Technical Features
- Switched from DiscordJS to Discordie (less crashes)
- Major performance improvements (less cost on CPU and RAM)


<a name="2.1.0" />
## 2.1.0 (March 1st, 2016)

#### Features
- Added `!snake`
- `!help` now comes in 40 different languages, users can use `!set-language` to set their preference

#### Bug Fixes
- Fixed LoL matches on EUNE servers
- Patched crashes when meme generator returns an invalid response
- Fixed editing messages not executing commands
- Temporarily disabled some comics providers due to errors
- Fixed bomb commands with negative numbers

#### Technical Details/Features
- Redis is now a dependency. See the README.
- Optimized docker image
- Upgraded to Phantom JS 2.1.1
- Clear DiscordJS cache on boot to optimize memory usage
- Upgraded Node to 4.3.1
- Upgraded NPM to 3.7.3


<a name="2.0.0" />
## 2.0.0 (February 3rd, 2016)

#### Features
- Added `!cat bomb`
- Added `!comics`
- Added `!popkey` gifs command
- Added `!pastebin`
- `!gif` now randomly picks between giphy and popkey for search
- Added 'bot' as a position for League commands
- Added Jihn to League commands
- Added generated image for `!lol counters`
- Retry commands when a user edits a message (to fix typos, for example)

#### Bug Fixes
- Infinite loop with reply commands like `!yoda` and `!snoopify`
- Fixed crash when bot is mentioned without a command
- Fixed commands not working when uppercased
- Bad layout formatting for League items command
- Fixed Wukong missing for League commands
- Fixed `!cat` returning invalid URLs
- Fixed champ names sometimes being invalid when querying Champion.gg
- Fixed docker builds
- Rewrote cleverbot for (hopeful) better performance

#### Technical Details/Features
- Initial ram usage dropped from 250MB to 80MB
- Initialization time dropped from ~8 seconds to ~3 seconds
- Reorganized all commands and folder structure to match `!help`
- Plenty of refactoring to better match ES6 standard
- Auto clean PMs older then 2 days
- Upgraded to PhantomJS 2

#### Breaking Changes
- `!pugbomb` renamed to `!pug bomb`
- Config file must now export as an ES5 module instead of ES6. See the [example](/config.js.example).

<a name="1.4.0" />
## 1.4.0 (Janurary 17th, 2016)

#### Features
- `!lol items` is the first command to return an [image response](https://github.com/Gravebot/Gravebot/pull/94) instead of text
- `!lol match` command to get player stats of a current match
- `!cat` command to send a cute cat picture
- `!dota2` commands now give stats and builds for DOTA2
- `!videocall` now lets you generate a one click video call and screen share link, either public or private
- `!version` command to load the latest information from this changelog in to Discord
- `!endall` command to end all arguments

#### Bug Fixes
- Spell check everywhere
- Added safeguard to `!roll` command that was causing crashes

<a name="1.3.0" />
## 1.3.0 (Janurary 8th, 2016)

#### Features
- Short hands for `!youtube` and `!wolfram` as `!yt` and `!wfa`
- Support for joining through PMs with just Discord invite links
- `!lol` `bans` and `best` to show the top bans and best champs in their respected positions
- `!lol counters` now sort by Champion.gg calculated stats score rather then win rate
- Better formatting for `!lol` commands
- `manlyman` and `patrick3` memes

#### Bug Fixes
- `!drama`, `!emoji`, and `!quote` commands to have access to all available results

#### Technical Features
- `EMAIL` and `PASSWORD` are checked for on boot
- Docker support with automated images based off Master branch
- Added sentry for error tracking
- Dropped `babel-node` binary to start app


<a name="1.2.0" />
## 1.2.0 (Janurary 5th, 2016)

#### Features
- Wolfram Alpha `!wolfram` commands. Ask anything!
- Emoji `!emoji` command to spam chat with glorious things
- Drama `!drama` command when things are getting a little hot in chat
- Added joined date and roles to `!serverinfo`
- Commands can be used with mentions to Gravebot, `@₪Gravebot₪ pugbomb 3`, and in private messages.

#### Bug Fixes
- Replaced `!yoda` command to rid of all the API errors


<a name="1.1.0" />
## 1.1.0 (Janurary 3rd, 2016)

#### Features
- League of Legends `!lol` commands
- Pugbomb `!pugbomb` command to spam chat with adorable pugs
- Yoda `!yoda` command to make your sentences sound like Yoda

#### Technical Features
- Converted stack to ES6
- Organized project for simpler contributions
- Test and coverage suite *(in progress)*

#### Bug Fixes
- `!youtube` now stops returning undefined and handles playlists
