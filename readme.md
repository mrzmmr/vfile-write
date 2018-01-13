# vfile-write

[![Travis](https://img.shields.io/travis/mrzmmr/vfile-write.svg)](https://travis-ci.org/mrzmmr/vfile-write)
[![Coveralls github](https://img.shields.io/coveralls/github/mrzmmr/vfile-write.svg)](https://travis-ci.org/mrzmmr/vfile-write)
[![David](https://img.shields.io/david/mrzmmr/vfile-write.svg)](https://david-dm.org/mrzmmr/vfile-write)

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