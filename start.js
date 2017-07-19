var keystone = require('keystone');
keystone.init({
	'name': 'intfinishes',
	'port': process.env.OPENSHIFT_NODEJS_PORT || 3000,
	'host': process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': ['public'],

	'views': 'templates/views',
	'view engine': 'jade',

	'auto update': true,
	'mongo': `mongodb://admin:g5aGrGp39TwM@${process.env.OPENSHIFT_MONGODB_DB_HOST}:${process.env.OPENSHIFT_MONGODB_DB_PORT}/`,
	// 'mongo:': 'mongodb://localhost/intfinishes',

	'session': true,
	'ssl': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': "x2Ky.=MP(@8[xU`h1ABem(N)uy9W2Wwsp+HSi?'6PMhS^x5_Z8,eC``RKrae1xi"
});

require('./models');
keystone.set('routes', require('./routes'));
keystone.start();