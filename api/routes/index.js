'use strict';

exports.register = (server, options, next) => {
	server.route(require('./Notes'));

	next();
};

exports.register.attributes = {
	pkg: {
		name: 'Route',
		version: '1.0.0'
	}
};
