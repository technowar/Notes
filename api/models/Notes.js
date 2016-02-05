'use strict';

const Mongoose = require('mongoose');

const NotesSchema = new Mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true,
		match: /^.{1,255}$/
	},
	password: {
		type: String
	},
	createdAt: {
		type: Date
	}
});

Mongoose.model('Notes', NotesSchema);
