'use strict';

var fs = require('fs');
var update = require('vfile-update');
var tape = require('blue-tape');
var rimraf = require('rimraf');
var vfile = require('vfile');
var write = require('./');

var file = vfile({
  path: 'foo',
  contents: [
    null,
    vfile({
      path: 'foo.txt',
      contents: 'Foo'
    }),
    vfile({
      contents: 'empty'
    }),
    vfile({
      path: 'bar',
      contents: [
        vfile({
          path: 'bar.txt',
          contents: 'Bar'
        }),
        vfile({
          path: 'baz',
          contents: []
        })
      ]
    })
  ]
});

function clean() {
  rimraf.sync('./foo.txt');
  rimraf.sync('./bar.txt');
  rimraf.sync('./foo');
  rimraf.sync('./baz');
}

tape('vfile-write', function (t) {
  t.test('should fail', function (t) {
    t.shouldFail(write(), 'bad arguments');
    t.shouldFail(write({}), 'bad arguments');
    t.end();
  });

  t.throws(function () {
    write({}, function (err) {
      if (err) {
        throw err;
      }
    });
  });

  t.test('single nested vfile', function (t) {
    return write(update(file)).then(function () {
      var stats = [
        fs.statSync('./foo/foo.txt'),
        fs.statSync('./foo/bar/bar.txt'),
        fs.statSync('./foo/bar/baz')
      ];

      t.ok(stats[0].isFile());
      t.ok(stats[1].isFile());
      t.ok(stats[2].isDirectory());
      clean();
    });
  });

  t.test('multiple vfiles', function (t) {
    return write(file).then(function () {
      var stats = [
        fs.statSync('./foo.txt'),
        fs.statSync('./bar.txt'),
        fs.statSync('./baz')
      ];

      t.ok(stats[0].isFile());
      t.ok(stats[1].isFile());
      t.ok(stats[2].isDirectory());
      clean();
    });
  });
  t.end();
});
