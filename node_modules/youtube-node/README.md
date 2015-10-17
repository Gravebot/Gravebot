# youtube-node [![Dependency Status](https://david-dm.org/paulomcnally/youtube-node.png)](https://david-dm.org/paulomcnally/youtube-node) [![NPM version](https://badge.fury.io/js/youtube-node.png)](http://badge.fury.io/js/youtube-node)

[![NPM](https://nodei.co/npm/youtube-node.png?downloads=true)](https://nodei.co/npm/youtube-node/)

* YouTube API v3 - Require key ([video](https://www.youtube.com/watch?v=Im69kzhpR3I))
* CLI

## CLI

For use CLI need install youtube-node using -g param.

    $ npm install youtube-node -g

#### CLI Example getById ( require key and video ID )

    $ youtube id


#### CLI Example search (require key, query and maxResults)

    $ youtube search

## Usage

#### Installation
    $ npm install youtube-node

#### Example search (search term, num results, results) return object
    var YouTube = require('youtube-node');

    var youTube = new YouTube();

    youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

    youTube.search('World War z Trailer', 2, function(error, result) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(JSON.stringify(result, null, 2));
      }
    });

See output: [https://gist.github.com/paulomcnally/620b76a9afe81f56e8c9](https://gist.github.com/paulomcnally/620b76a9afe81f56e8c9)

#### Example getById (youtube id, result) return object
    var YouTube = require('youtube-node');

    var youTube = new YouTube();
    youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

    youTube.getById('HcwTxRuq-uk', function(error, result) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(JSON.stringify(result, null, 2));
      }
    });

See output: [https://gist.github.com/paulomcnally/50e0b96291c82b87009b](https://gist.github.com/paulomcnally/50e0b96291c82b87009b)

#### Example related (youtube id, maxResults, result) return object

    var YouTube = require('youtube-node');

    var youTube = new YouTube();

    youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

    youTube.related('hafhSaP_Nh4', 2, function(error, result) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(JSON.stringify(result, null, 2));
      }
    });

See output:
[https://gist.github.com/paulomcnally/ebab23c68c374723f28a](https://gist.github.com/paulomcnally/ebab23c68c374723f28a)

#### Optional Parameters

[https://developers.google.com/youtube/v3/docs/search/list#optional-parameters](https://developers.google.com/youtube/v3/docs/search/list#optional-parameters)

To set an optional parameter use:

    youTube.addParam('order', 'title');

### For older version use:

    $ npm install youtube-node@0.0.4

**Older version use API v2 and is not recommended**

## Those who use it?
* [http://sync.club/](http://sync.club/#dev-session)
