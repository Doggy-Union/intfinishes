var keystone = require('keystone'),
	importRoutes = keystone.importer(__dirname),
	https = require('https'),
	multer = require('multer'),
	// bodyParser = require('body-parser'),
	upload = multer().single('image'),
	middleware = require('./middleware');

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
keystone.pre('routes', middleware.secureRedirect);
keystone.pre('static', middleware.secureRedirect);

// Load Routes
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Bind Routes
exports = module.exports = function(app) {
	app.get('/', routes.views.view);
	app.get('/.well-known/acme-challenge/:challengeHash', function(req, res) {
	    var hash = req.params.challengeHash;
	    res.send(hash + '.UlLLEEZQuSBOxhO8W20LKMtd6LhjEr39n5felDCXDPc');
	});

	app.post('/?*', routes.api.upload); // Handling POST request
}

// Handle 404 errors
keystone.set('404', function(req, res, next) {
	res.notfound();
});

// Handle other errors
keystone.set('500', function(err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.messasge;
		err = err.stack;
	}
	console.log(err);
	res.err(err, title, message);
});