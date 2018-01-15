# vfile-write

[![Travis](https://img.shields.io/travis/mrzmmr/vfile-write.svg)](https://travis-ci.org/mrzmmr/vfile-write)
[![Coveralls github](https://img.shields.io/coveralls/github/mrzmmr/vfile-write.svg)](https://travis-ci.org/mrzmmr/vfile-write)
[![David](https://img.shields.io/david/mrzmmr/vfile-write.svg)](https://david-dm.org/mrzmmr/vfile-write)

Writes a [VFile](https://github.com/vfile/vfile) and any vfiles nested in its contents. Write will also create any directories needed as well as the file. Returns a promise or callback. 

## install

```sh
npm i -S vfile-write
```

## usage

```js
var write = require('vfile-write')
var vfile = require('vfile')
var file = vfile({
  path: 'foo',
  contents: [
    vfile({
      path: 'foo.txt',
      contents: 'Foo'
    }),
    vfile({
      path: 'bar',
      contents: [
        vfile({
          path: 'bar.txt',
          contents: 'Bar'
        }),
        vfile('baz')
      })
    })
  })
})

write(update(file))
  .catch(console.err)
```

outputs:

```sh
foo
  |- foo.txt
    |- bar
      |- bar.txt
      |- baz
```

## api

### `write(file[, options[, callback]])`

#### `file`
`VFile`

VFile to write. 

#### `options`?
`object`

Options to pass to writeFile and/or mkdir.

#### `callback`?
`function`

Optional callback function. `callback(err)`

`returns` a promise or callback.

### `write#sync(file[, options])`

Synchronous version of write.

## related

[to-vfile](https://github.com/vfile/to-vfile) - Create a vfile from a file-path

## License

MIT &copy; Paul Zimmer
