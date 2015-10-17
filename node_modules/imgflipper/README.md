# Imgflipper

A simple module for generating meme images using imgflip.

## Use

```js
var Imgflipper = require("imgflipper");

// other code here
// define cb(), etc.

var imgflipper = new Imgflipper("username", "pass");
imgflipper.generateMeme(61546, "Brace yourselves", "the sprint planning session is coming", cb);
```

Note that you need to know the meme ID in order for this library to be of much use.

You can lookup the most popular meme IDs on [imgflip's API documentation site](https://api.imgflip.com/popular_meme_ids).


## Test

In order to run the unit tests, you'll need to set the IMGFLIP_USERNAME and IMGFLIP_PASSWORD environment variables to your imgflip account credentials.


