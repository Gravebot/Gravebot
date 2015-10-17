var assert = require("assert"),
	fs = require("fs"),
	Imgflipper = require("../index.js");

var IMGFLIP_USERNAME = process.env.IMGFLIP_USERNAME,
	IMGFLIP_PASSWORD = process.env.IMGFLIP_PASSWORD;

describe("Imgflipper", function () {
	describe("#generateMeme()", function () {
		it("should return a valid url to a meme image", function (done) {
			var imgflipper = new Imgflipper(IMGFLIP_USERNAME, IMGFLIP_PASSWORD),
				cb = function (err, url) {
					assert.ifError(err);
					assert.ok(url);

					done();
				};

			imgflipper.generateMeme(61546, "Brace yourselves", "the sprint planning session is coming", cb);
		});
	});

	describe("#generateMemeImage()", function () {
		it("should write the generated meme image to the stream", function (done) {
			var imgflipper = new Imgflipper(IMGFLIP_USERNAME, IMGFLIP_PASSWORD),
				filename = "meme.jpg",
				fstream = fs.createWriteStream(filename),
				cb = function (err) {
					assert.ifError(err);

					var stats = fs.statSync(filename);
					assert.ok(stats);
					assert(stats.size > 0);

					fs.unlinkSync(filename);
					done();
				};

			imgflipper.generateMemeImage(61546, "Brace yourselves", "the sprint planning session is coming", fstream, cb);
		});
	});
});
