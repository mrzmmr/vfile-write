# vfile-write

[![Travis](https://img.shields.io/travis/mrzmmr/vfile-write.svg)](https://travis-ci.org/mrzmmr/vfile-write)
[![Coveralls github](https://img.shields.io/coveralls/github/mrzmmr/vfile-write.svg)](https://travis-ci.org/mrzmmr/vfile-write)
[![David](https://img.shields.io/david/mrzmmr/vfile-write.svg)](https://david-dm.org/mrzmmr/vfile-write)

Writes a [VFile](https://github.com/vfile/vfile) and any vfiles nested in its contents. Write will also create any directories needed as well as the file. Returns a promise or callback. 

## Install

```sh
npm i -S vfile-write
```

## Usage

The following script:

```js
var write = require('./lib')
var vfile = require('vfile')

var file = vfile({
	path: 'one',
	contents: [
		vfile({
			path: 'one.txt',
			contents: 'one'
		}),
		vfile({
			path: 'two',
			contents: [
				vfile({
					path: 'two.txt',
					contents: 'two'
				})
			]
		})
	]
})

write(file, 'utf-8').catch(console.error)
```

Will create the file structure:

```text
one
├── one.txt
└── two
    └── two.txt
```

## Api

### `write(file[, options[, callback]])`

#### `file`
`VFile`

VFile to write. 

#### `options`?
`object`

Options to pass to writeFile and/or mkdir.

#### `callback`?
`function`

Optional callback function. `callback(error, files)`

`returns` a promise or callback.

### `write#sync(file[, options])`

Synchronous version of write.

## Related

[vfile-read](https://github.com/mrzmmr/vfile-read)

[vfile-update](https://github.com/mrzmmr/vfile-update)

[to-vfile](https://github.com/vfile/to-vfile)

## License

MIT &copy; Paul Zimmer
