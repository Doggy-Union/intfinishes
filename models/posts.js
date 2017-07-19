var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Post = new keystone.List('Post', {
	autokey: {
		from: 'title',
		unique: true,
		path: 'slug'
	},
	defaultSort: '-createdAt'
});

Post.add({
	title: { type: String, required: true, initial: true },
	image: { type: String, initial: true },
	createdAt: { type: Types.Datetime, default: Date.now },
	description: { type: Types.Textarea, initial: true }
});

Post.register();