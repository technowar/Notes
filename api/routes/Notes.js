'use strict';

const Mongoose = require('mongoose');

const Notes = Mongoose.model('Notes');

Date.prototype.addHours = function (hours) {
	this.setHours(this.getHours() + hours);

	return this;
}

module.exports = [{
	method: 'GET',
	path: '/views/css/{params*}',
	config: {
		handler: {
			directory: {
				path: process.cwd() + '/views/css'
			}
		}
	}
}, {
	method: 'GET',
	path: '/{params*}',
	config: {
		handler: (request, reply) => {
			let param = request.params.params;

			function getParam (param) {
				let paramOptions = {
					'undefined' : () => {
						return reply.view('template/index').code(200);
					},
					'favicon.ico' : () => {
						return;
					},
					'defaults' : () => {
						Notes.findOne({
							title: param
						}, {}, {
							sort: {
								createdAt: -1
							}
						}, (error, data) => {
							let result = {};

							if (data && new Date() < new Date(data.createdAt).addHours(3)) {
								if (data && data.password) {
									result.title = param;

									return reply.view('template/note/login', result).code(200);
								}

								return reply.view('template/note/note', data).code(200);
							}

							result.title = param;

							reply.view('template/note/index', result).code(200);
						});
					}
				};

				return (paramOptions[param] || paramOptions['defaults'])();
			}

			getParam(param);
		}
	}
}, {
	method: 'POST',
	path: '/{params*}',
	config: {
		handler: (request, reply) => {
			let param = request.params.params;

			Notes.findOne({
				title: param
			}, {}, {
				sort: {
					createdAt: -1
				}
			}, (error, data) => {
				let result = {};

				if (data && new Date() > new Date(data.createdAt).addHours(3) || !data) {
					let newNote = new Notes({
						title: request.payload.title,
						content: request.payload.content,
						password: request.payload.password,
						createdAt: new Date()
					});

					return newNote.save((error, data) => {
						if (error) {
							result.title = 'Bad Request';

							return reply.view('template/note/error', result).code(500);
						}

						reply.view('template/note/note', data).code(201);
					});
				}

				if (request.payload.password === data.password) {
					return reply.view('template/note/note', data).code(200);
				}

				result.title = 'Incorrect Password';

				reply.view('template/note/error', result).code(401);
			});
		}
	}
}];
