var YouTube = require('./youtube');
var prompt = require('prompt');
var colors = require('colors');

var youTube = new YouTube();

var cli = {
  id: function() {
    prompt.start();
    prompt.get(['key', 'id'], function(err, result) {
      youTube.setKey(result.key);
      youTube.getById(result.id, function(error, result) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(JSON.stringify(result, null, 2));
        }
      });
    });
  },

  search: function() {
    prompt.start();
    prompt.get(['key', 'query', 'maxResults'], function(err, result) {
      youTube.setKey(result.key);
      youTube.search(result.query, result.maxResults, function(error, result) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(JSON.stringify(result, null, 2));
        }
      });
    });
  },

  related: function() {
    prompt.start();
    prompt.get(['key', 'id', 'maxResults'], function(err, result) {
      youTube.setKey(result.key);
      youTube.related(result.id, result.maxResults, function(error, result) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(JSON.stringify(result, null, 2));
        }
      });
    });
  },

  error: function(param) {
    var message = '';
    switch (param){
      case 0:
        message = 'Required to enter a command.';
      break;
      case 1:
        message = 'The command you entered does not exist.';
      break;
    }
    console.log(colors.red(message));
  }
};

module.exports = cli;
