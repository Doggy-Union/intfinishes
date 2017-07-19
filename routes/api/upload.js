var multer = require('multer');
var path = require('path');
var upload = multer().single('image');
var https = require('https');
var keystone = require('keystone');
var formData = require('form-data');
var form = new formData();
var Post = keystone.list('Post');
// var middleware = require("./middleware")

function makeHTMLAnswer(msg, onNewPost) {
	if (onNewPost) return '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0"> <title>Message</title> </head> <body> <h1>' + msg + '</h1> <script> setTimeout(function() { window.location.replace(window.location.origin); }, 3000); </script> </body> </html>';
	return '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0"> <title>Message</title> </head> <body> <h1>' + msg + '</h1> <script> setTimeout(function() { window.location.replace(window.location.origin + "?page=1"); }, 3000); </script> </body> </html>';
}

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	view.on('init', function(next) {
	Post.model.find()
	    .sort('-createdAt')
	    .exec(function(err, posts) {
	    	locals.res = [];
	    	locals.res = posts;
	    	console.log(posts);
	    	next();
	    });
	});
	res.status(200);

	upload(req, res, function(err) {
		if(err) {
			return res.status(201).end();
		}

		var options = {
			"method": "POST",
			"hostname": "api.imgur.com",
			"path": "/3/image",
			"headers": {
				"authorization": "Client-ID 434e60552e1fc5c",
				"content-type": "application/x-www-form-urlencoded"
			}
		};

		var requestToImgur = https.request(options, function(responseFromImgur) {
			var chunks = [];

			responseFromImgur.on("data", function (chunk) {
				chunks.push(chunk);
			});

			responseFromImgur.on("end", function () {
				var body = Buffer.concat(chunks);
				console.log(body.toString());
				try {
					var json = JSON.parse(body.toString());
				}

				catch (err) {
					req.flash('error', 'Изображение не загружено, произошла ошибка API.');
					res.status(200).send(makeHTMLAnswer('Изображение не загружено, произошла ошибка API.', false));
					view.render('index');
				}

				if (json.success) {
					var newPost = new Post.model({
						title: req.body.title,
						image: json.data.link.slice(0, 4) + 's' + json.data.link.slice(4),
						description: req.body.description
					});

					newPost.save(function(err) {
						if (err) {
							console.log(err);
						}
						req.flash('success', 'Изображение загружено! :з');
						res.status(200).send(makeHTMLAnswer('Изображение загружено! :з', true));
					});
				} else {
					req.flash('error', 'Изображение не загружено, произошла ошибка API.');
					res.status(200).send(makeHTMLAnswer('Изображение не загружено, произошла ошибка API.', false));
					res.end();
				}
			});
		});

		/*form.append('image', req.file.buffer);
		form.pipe(requestToImgur, { end: false });

		form.on('end', () => {
		  requestToImgur.end();
		});*/
		if (!req.file || !req.body.title || !req.body.description) {
			req.flash('warning', 'Пожалуйста, введите все данные для загрузки.');
			res.status(200).send(makeHTMLAnswer('Пожалуйста, введите все данные для загрузки.', false));
			res.end();
		} else {
			requestToImgur.end(req.file.buffer);
		}
	});
}