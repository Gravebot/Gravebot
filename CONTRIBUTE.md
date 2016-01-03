# Contribute

Contributing to Gravebot is super easy, we just have a few rules.

## Rules

Gravebot is written in ES6/Babel javascript, we try to avoid ES5 as much as possible.

- No using `var`, instead properly using `let` and `const`
- Using `import` and `export` for modules, and avoiding using `require` unless it's for JSON
- All variables are `snaked_case`
- All functions are `camelCased`
- Everything must pass lint, run `npm run lint`.
- Tests are required for all functions
- Avoid adding new modules if there is already one that does something similar. For example, don't add `lodash` as were already using `ramda`, or don't add `Q` as were already using `bluebird`.
- Avoid adding images to the repo if possible, but instead upload them to [imgur](https://imgur.com/) to improve performance.

## Instructions

To add a new command, create a new javascript file in [`/lib`](/lib) and name it to something that resembles your to be functions. For example all the Discord server commands can be found in [`/lib/server.js`](/lib/server.js).

All functions are sent the [discord client instance](https://discordjs.readthedocs.org/en/latest/docs_client.html), [msg object](https://discordjs.readthedocs.org/en/latest/docs_message.html), and the command text *(minus the command itself)* as parameters. A good example of this can be found in [`/lib/yoda.js`](/lib/yoda.js).

It's good to default to some help text if someone is improperly using your commands. With a little string interpolation and some markdown, it's pretty easy to describe to a user how your commands work. Check out [`/lib/leagueoflegends.js`](/lib/leagueoflegends.js) or [`/lib/help`](/lib/help).

After you've completed writing, export a default object with the key name being the name of the discord command. Again, a good example of this can be found in [`/lib/yoda.js`](/lib/yoda.js). You can export multiple commands and everything will be merged on run.

Tests are required for all new functions, examples can be found in [/tests](/tests) This project already uses [`mocha`](https://mochajs.org/), [`nock`](https://github.com/pgte/nock), [`chai`](http://chaijs.com/), and [`sinon`](http://sinonjs.org/docs/), which should be more than enough to write any tests needed. Tests are run with `npm run mocha`.

Once everything is up to par, feel free to through up a pull request. For pull request formatting, check out [#7](https://github.com/Gravestorm/Gravebot/pull/7) and [#2](https://github.com/Gravestorm/Gravebot/pull/2)
