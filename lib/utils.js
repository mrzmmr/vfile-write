'use strict';

const flatten = file => {
	const done = [];

	const each = file => {
		done.push(file);

		if (Array.isArray(file.contents)) {
			file.contents.forEach(each);
		}
	};

	each(file);

	return done;
};

const vfileish = source => {
	return Boolean(
		source &&
		source.path &&
		source.contents
	);
};

const promised = (fn, file, options) => {
	return new Promise((resolve, reject) => {
		return fn(file, options, (error, files) => {
			if (error) {
				return reject(error);
			}
			return resolve(files);
		});
	});
};

const setup = (options, fn) => {
	if (typeof options === 'function') {
		fn = options;
		options = {};
	}
	if (typeof options === 'string') {
		options = {
			encoding: options
		};
	}
	return [options, fn];
};

module.exports = {
	flatten,
	vfileish,
	promised,
	setup
};
