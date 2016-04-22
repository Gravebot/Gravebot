# Contribute

Contributing to Gravebot is super easy, we just have a few rules.

## Code

#### Rules

Gravebot is written in ES6/Babel javascript, we try to keep to that then the ES5 alternatives.

- No using `var`, instead properly using `let` and `const`
- Using `import` and `export` for modules, and avoiding using `require` unless it's for JSON
- All variables are `snaked_case`
- All functions are `camelCased`
- Everything must pass lint (`npm run lint`).
- Tests are required for all functions
- Avoid adding new modules if there is already one that does something similar. For example, don't add `lodash` as we're already using `ramda`, or don't add `Q` as we're already using `bluebird`.
- Avoid adding images to the repo if possible, but instead upload them to [imgur](https://imgur.com/) to improve performance.

#### Instructions

__Creating a new module__

To add a new command, create a new javascript file in [`/src/commands`](/src/commands) and name it to something that resembles your to be functions. For example all the Discord server commands can be found in [`/src/commands/info.js`](/src/commands/info.js).

All functions are passed the [Discordie client](https://qeled.github.io/discordie/#/docs/Discordie?_k=7pztxz), [message event](https://qeled.github.io/discordie/#/docs/IMessage?_k=bjv5md), the command suffix, and the users language. All functions are to return a Bluebird promise of either a string, number, or Buffer. An array of any of the three is [also accepted](https://github.com/Gravebot/Gravebot/blob/Rewrite/src/index.js#L27-L56). A good example of this can be found in [`/src/commands/fun/transate.js`](/src/commands/fun/transate.js).

It's good to default to some help text if someone is improperly using your commands. With a little string interpolation and some markdown, it's pretty easy to describe to a user how your commands work. Check out [`/src/commands/games/leagueoflegends/`](/src/commands/games/leagueoflegends/) or [`/src/commands/help`](/src/commands/help).

After you've completed writing, export a default object with the key name being the name of the discord command. Again, a good example of this can be found in [`/src/commands/fun/transate.js`](/src/commands/fun/transate.js). You can export multiple commands and everything will be merged on run.

__Image Responses__

If you'd prefer to develop an image response instead of a text response, take a look at the League of Legends [`items`](https://github.com/Gravestorm/Gravebot/blob/master/src/commands/games/leagueoflegends/championgg.js) commands. The images are HTML/Jade views using Stylus as the css pre-compiler. The images should try to fit in with the look of Discord. Please reframe from loading remote dependencies, but instead save them locally in the repo within the `web` folder.

__Tests__

Tests are required for all new functions, examples can be found in [/tests](/tests) This project already uses [`mocha`](https://mochajs.org/), [`nock`](https://github.com/pgte/nock), [`chai`](http://chaijs.com/), and [`sinon`](http://sinonjs.org/docs/), which should be more than enough to write any tests needed. Tests are run with `npm run mocha`.


__Pull Requests__

Once everything is up to par, feel free to through up a pull request. For pull request formatting, check out [#7](https://github.com/Gravestorm/Gravebot/pull/7) and [#2](https://github.com/Gravestorm/Gravebot/pull/2)


## Translations
We use [Transifex](https://www.transifex.com/gravebot/gravebot) to manage all translations, it's super easy and lets everyone contribute! The initial translations were done with Google Translate, so just because a translation exists doesn't mean it's correct. You can also check out the language status list below to see which have been done by Google, and which has had attention from a native speaker.

__Rules__
- Make sure to check if a translation has been done already before writing it over again.
- If you have an issue with someone else's translation, please use the comments section.
- Don't add extra punctuations (such as `...`) to the end of translations if the English version doesn't have it.

__Setup__
- Create an account with [Transifex](https://www.transifex.com/signin/) (Or login with Github/Google/Facebook/ect)
- Join the Gravebot team with the language you'd like to work on
- Start!

__Language Status__

| Language | Finished |
| ------------- | -----:|
| English | Yes |
| Arabic | No |
| Bosnian | No |
| Bulgarian | No |
| Catalan | No |
| Croatian | No |
| Chinese Simplified | No |
| Chinese Traditional | No |
| Danish | No |
| Dutch | No |
| Finnish | No |
| French | No |
| German | No |
| Georgian | No |
| Greek | No |
| Hebrew | No |
| Hungarian | No |
| Indonesian | No |
| Italian | No |
| Japanese | No |
| Korean | No |
| Latvian | No |
| Lithuanian | No |
| Malay | No |
| Norwegian | No |
| Polish | No |
| Portuguese | No |
| Portuguese Brazil | No |
| Romanian | No |
| Russian | No |
| Serbian | No |
| Slovak | No |
| Slovenian | No |
| Spanish | No |
| Swedish | No |
| Thai | No |
| Turkish | No |
| Vietnamese | No |

Please prevent from putting translations in PRs, we'd rather keep those for code.
