var request = require("request");

// # Imgflipper
//
// Simple class for generating meme images using imgflip
//
// How to use:
//
// var imgflipper = new Imgflipper("user", "pass");
// imgflipper.generateMeme(123, "brace yourselves...", "the sprint planning session is coming.", cb)
//
// cb(err, imgUrl)
function Imgflipper(username, password) {
	this.username = username;
	this.password = password;
	var me = this;

	// ## generateMeme
	//
	// generates a meme image using imglip & returns the url
	// cb(err, url)
	this.generateMeme = function (templateId, text0, text1, cb) {
		// format the request
		var data = {
			template_id: templateId,
			username: me.username,
			password: me.password,
			text0: text0,
			text1: text1
		};

		// send and return image if successful
		request.post(
			{
				url: "https://api.imgflip.com/caption_image",
				form: data
			},
			function (err, httpResponse, body) {
				if (err) {
					cb(err);
				}
				else {
					body = JSON.parse(body);

					if (!body.success) {
						cb(new Error(body.error_message));
					}
					else {
						cb(null, body.data.url);
					}
				}
			}
		);
	};

	// ## generateMemeImage
	//
	// generates a meme image and writes to the specified file stream
	// cb(err)
	this.generateMemeImage = function (templateId, text0, text1, fstream, cb) {
		me.generateMeme(templateId, text0, text1, function (err, url) {
			if (err) {
				cb(err);
			}
			else {
				request
					.get(url)
					.on("error", cb)
					.on("end", function () {
						cb();
					})
					.pipe(fstream);
			}
		});
	};
}

module.exports = Imgflipper;
