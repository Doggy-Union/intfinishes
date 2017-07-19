var keystone = require('keystone'),
	Post = keystone.list('Post');

exports = module.exports = function(req, res) {
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

	view.render('index');
}