'use strict';

const Hapi = require('hapi');
const Mongoose = require('mongoose');

const Server = new Hapi.Server();

const MongooseURL = process.env.MONGO_URL || 'mongodb://localhost/notes';
const PORT = process.env.PORT || 8000;

Server.connection({
	port: PORT
});

Mongoose.connect(MongooseURL);

require('./api/models/Notes');

Server.register([{
	register: require('inert')
}, {
	register: require('vision')
}, {
	register: require('./api/routes')
}], error => {
	if (!error) {
		Server.views({
			engines: {
				html: require('handlebars')
			},
			path: __dirname + '/views',
			layout: true
		});

		Server.start(error => {
			if (!error) {
				console.log(`Now listening to ${PORT}`);
			}
		});
	}
});