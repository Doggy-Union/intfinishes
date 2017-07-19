var keystone = require('keystone'),
	Post = keystone.list('Post');

exports = module.exports = function(req, res) {
	//render whole this russian story;
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	view.on('init', function(next) {
	Post.model.find()
	    .sort('-createdAt')
	    .exec(function(err, posts) {
	    	locals.slides = [];
	    	locals.slides = posts;
	    	console.log(posts);
	    	next();
	    });
	});
	
	view.render('dos');
}