# retext-metaphone [![Build Status](https://travis-ci.org/wooorm/retext-metaphone.svg?branch=master)](https://travis-ci.org/wooorm/retext-metaphone) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-metaphone.svg)](https://coveralls.io/r/wooorm/retext-metaphone?branch=master)

[![browser support](https://ci.testling.com/wooorm/retext-metaphone.png) ](https://ci.testling.com/wooorm/retext-metaphone)

---

**[Retext](https://github.com/wooorm/retext "Retext")** implementation of the [original Metaphone](http://en.wikipedia.org/wiki/Metaphone) algorithm.

## Installation

NPM:
```sh
$ npm install retext-metaphone
```

Component.js:
```sh
$ component install wooorm/retext-metaphone
```

## Usage

```js
var Retext = require('retext'),
    visit = require('retext-visit'),
    metaphone = require('retext-metaphone');

var root = new Retext()
    .use(visit)
    .use(metaphone)
    .parse('A simple english sentence.');

root.visitType(root.WORD_NODE, function (node) {
    console.log(node.toString(), node.data.phonetics);
});
// 'A', 'A'
// 'simple', 'SMPL'
// 'english', 'ENKLKSH'
// 'sentence', 'SNTNS'
```

You can also combine it with a stemmer (e.g., [retext-porter-stemmer](https://github.com/wooorm/retext-porter-stemmer))

```js
var Retext = require('retext'),
    visit = require('retext-visit'),
    metaphone = require('retext-metaphone'),
    stemmer = require('retext-porter-stemmer');

var root = new Retext()
    .use(visit)
    .use(metaphone)
    .use(stemmer)
    .parse('A detestable paragraph');

root.visitType(root.WORD_NODE, function (node) {
    console.log(node.toString(), node.data.phonetics, node.data.stemmedPhonetics);
});
// 'A', 'A', 'A'
// 'detestable', 'TTSTBL', 'TTST'
// 'paragraph', 'PRKRF', 'PRKRF'
```

Both examples also uses [retext-visit](https://github.com/wooorm/retext-visit).

## API
None, the plugin automatically detects the phonetics of each word when its created or changed, and stores the phonetics in `wordNode.data.phonetics`.

## License

  MIT
