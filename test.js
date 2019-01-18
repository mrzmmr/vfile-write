'use strict';

const {statSync, readFileSync} = require('fs');
const rimraf = require('rimraf');
const {test} = require('tap');
const write = require('./lib');

const clean = path => {
	rimraf.sync(path);
};

test('vfile-write', t => {
	t.plan(17);

	write().then(
		() => t.fail('Expected to error.'),
		error => {
			t.equal(
				error.message,
				'Expected a vfile to write.',
				'should throw with bad file argument.'
			);
		}
	);

	write(false).then(
		() => t.fail('Expected to error.'),
		error => {
			t.equal(
				error.message,
				'Expected a vfile to write.',
				'should throw with bad file argument.'
			);
		}
	);

	write({path: '1', contents: []}, {mode: 'oops'}).then(
		() => t.fail('Expected to error.'),
		error => t.pass('should catch mkdirp error.', error)
	);

	write({path: '2', contents: '2'}, {mode: 'oops'}, error => {
		if (error) {
			t.pass('should catch mkdirp error.', error);
		} else {
			t.fail('Expected to error.');
		}
		clean('./2');
	});

	write({path: '3', contents: []}).then(
		files => {
			t.equal(
				files.length,
				1,
				'should return with array of files.'
			);

			t.equal(
				statSync('./3').isDirectory(),
				true,
				'should create directory 3.'
			);

			clean('./3');
		},
		t.fail
	);

	write(
		{
			path: '4',
			contents: [{
				path: '5',
				contents: '5'
			}]
		}
	).then(
		files => {
			t.equal(
				files.length,
				2,
				'should create 2 files.'
			);
			t.equal(
				statSync('./4').isDirectory(),
				true,
				'should create directory 4.'
			);
			t.deepEqual(
				readFileSync('./4/5'),
				Buffer.from('5'),
				'should create ./4/5 as buffer by default.'
			);

			clean('./4');
		},
		t.fail
	);

	write({path: '5', contents: []}, (error, files) => {
		if (error) {
			t.fail(error);
		}

		t.equal(
			files.length,
			1,
			'should create 1 file.'
		);

		t.equal(
			statSync('./5').isDirectory(),
			true,
			'should create directory 5.'
		);

		clean('./5');
	});

	write({path: '6', contents: 'root'}, 'utf-8', (error, files) => {
		if (error) {
			t.fail(error);
		}

		t.equal(
			files.length,
			1,
			'should create 1 file.'
		);

		clean('./6');
	});

	t.throws(
		() => write.sync(),
		/Expected a vfile to write./,
		'should throw with bad file argument.'
	);

	t.throws(
		() => write.sync(false),
		/Expected a vfile to write./,
		'should throw with bad file argument.'
	);

	t.throws(
		() => write.sync(
			{path: '7', contents: '7'},
			{mode: 'oops'}
		),
		'should catch mkdirp error.'
	);

	t.equal(
		write.sync({path: '8', contents: []}).length,
		1,
		'should create 1 file.'
	);

	t.equal(
		statSync('./8').isDirectory(),
		true,
		'should create directory 8.'
	);

	clean('./8');
});
