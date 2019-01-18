'use strict';

const {writeFile, writeFileSync} = require('fs');
const update = require('vfile-update');
const mkdirp = require('mkdirp');
const {promised, vfileish, flatten, setup} = require('./utils');

const write = (file, options, callback) => {
	const [settings, fn] = setup(options, callback);

	if (!fn) {
		return promised(write, file, options);
	}

	if (!file || !vfileish(file)) {
		return fn(new Error('Expected a vfile to write.'));
	}

	const next = error => {
		/* istanbul ignore next */
		if (error) {
			return fn(error);
		}
		return step();
	};

	const createDirectory = ({path}) => {
		try {
			return mkdirp(path, settings, next);
		} catch (error) {
			return next(error);
		}
	};

	const createFile = ({dirname, path, contents}) => {
		try {
			return mkdirp(dirname, settings, error => {
				/* istanbul ignore next */
				if (error) {
					return fn(error);
				}

				return writeFile(path, contents, settings, next);
			});
		} catch (error) {
			return next(error);
		}
	};

	const step = () => {
		if (files.length === 0) {
			return fn(null, original);
		}

		const current = files.shift();

		if (Array.isArray(current.contents)) {
			return createDirectory(current);
		}

		return createFile(current);
	};

	const files = flatten(update(file));
	const original = [...files];

	return step();
};

const sync = (file, options) => {
	const [settings] = setup(options);

	if (!file || !vfileish(file)) {
		throw new Error('Expected a vfile to write.');
	}

	const each = ({dirname, path, contents}) => {
		if (Array.isArray(contents)) {
			return mkdirp.sync(path, settings);
		}

		mkdirp.sync(dirname, settings);
		return writeFileSync(path, contents, settings);
	};

	const files = flatten(update(file));

	files.forEach(each);

	return files;
};

module.exports = write;

module.exports.sync = sync;
