'use strict';

var fs = require('fs');
var vfile = require('vfile');
var mkdirp = require('mkdirp');

module.exports = write;
module.exports.flatten = flatten;
module.exports.sync = writeSync;

function flatten(file) {
  var flattened;
  var current;
  var queue;
  var i;

  queue = [file];
  flattened = [];

  while (queue.length > 0) {
    current = queue.shift();

    if (!current) {
      continue;
    }

    if (Array.isArray(current.contents)) {
      if (current.contents.length > 0) {
        i = -1;

        while (i++ < current.contents.length - 1) {
          queue.push(current.contents[i]);
        }
      } else {
        flattened.push(current);
      }
    } else {
      flattened.push(current);
    }
  }
  return flattened;
}

function write(file, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    options = options || {};
  }

  if (!callback) {
    return new Promise(function (resolve, reject) {
      return write(file, options, function (err, done) {
        if (err) {
          return reject(err);
        }
        return resolve(done);
      });
    });
  }

  if (!file || !(file instanceof vfile)) {
    return callback(new Error('Expected a VFile to write.'));
  }

  var files = flatten(file);
  var done = [];

  return step();

  function step() {
    if (files.length < 1) {
      return callback(null, done);
    }

    var current = files.shift();

    if (!current || !current.path) {
      return step();
    }

    if (Array.isArray(current.contents)) {
      return mkdirp(current.path, options, function (err) {
       /* istanbul ignore if *//* error throws */
        if (err) {
          return callback(err);
        }

        done.push(current);
        return step();
      });
    }
    return mkdirp(current.dirname, options, function (err) {
     /* istanbul ignore if *//* fs error */
      if (err) {
        return callback(err);
      }

      return fs.writeFile(current.path, current.contents, options, function (err) {
        /* istanbul ignore if *//* error throws */
        if (err) {
          return callback(err);
        }

        done.push(current);
        return step();
      });
    });
  }
}

function writeSync(file, options) {
  var current;
  var files;

  options = options || {};
  files = flatten(file);

  while (files.length > 0) {
    current = files.shift();

    if (!current.path) {
      continue;
    }

    if (Array.isArray(current.contents)) {
      mkdirp.sync(current.path, options);
    } else {
      mkdirp.sync(current.dirname, options);
      fs.writeFileSync(current.path, current.contents, options);
    }
  }
}
