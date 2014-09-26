# retext-double-metaphone [![Build Status](https://travis-ci.org/wooorm/retext-double-metaphone.svg?branch=master)](https://travis-ci.org/wooorm/retext-double-metaphone) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-double-metaphone.svg)](https://coveralls.io/r/wooorm/retext-double-metaphone?branch=master)

**[Retext](https://github.com/wooorm/retext "Retext")** implementation of the [Double Metaphone](http://en.wikipedia.org/wiki/metaphone) algorithm.

## Installation

NPM:
```sh
$ npm install retext-double-metaphone
```

Component.js:
```sh
$ component install wooorm/retext-double-metaphone
```

## Usage

```js
var Retext = require('retext'),
    visit = require('retext-visit'),
    doubleMetaphone = require('retext-double-metaphone');

var root = new Retext()
    .use(visit)
    .use(doubleMetaphone)
    .parse('A simple english sentence.');

root.visitType(root.WORD_NODE, function (node) {
    console.log(node.toString(), node.data.phonetics);
});
// A [ 'A', 'A' ]
// simple [ 'SMPL', 'SMPL' ]
// english [ 'ANKLX', 'ANLX' ]
// sentence [ 'SNTNS', 'SNTNS' ]
```

You can also combine it with a stemmer (e.g., [retext-porter-stemmer](https://github.com/wooorm/retext-porter-stemmer))

```js
var Retext = require('retext'),
    visit = require('retext-visit'),
    doubleMetaphone = require('retext-double-metaphone'),
    stemmer = require('retext-porter-stemmer');

var root = new Retext()
    .use(visit)
    .use(doubleMetaphone)
    .use(stemmer)
    .parse('A detestable paragraph');

root.visitType(root.WORD_NODE, function (node) {
    console.log(node.toString(), node.data.phonetics, node.data.stemmedPhonetics);
});
// A [ 'A', 'A' ] [ 'A', 'A' ]
// detestable [ 'TTSTPL', 'TTSTPL' ] [ 'TTST', 'TTST' ]
// paragraph [ 'PRKRF', 'PRKRF' ] [ 'PRKRF', 'PRKRF' ]
```

Both examples also uses [retext-visit](https://github.com/wooorm/retext-visit).

## API
None, the plugin automatically detects the phonetics of each word (using [wooorm/double-metaphone](https://github.com/wooorm/double-metaphone)) when its created or changed, and stores the phonetics in `wordNode.data.phonetics`.

## License

  MIT
