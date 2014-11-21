# retext-double-metaphone [![Build Status](https://img.shields.io/travis/wooorm/retext-double-metaphone.svg?style=flat)](https://travis-ci.org/wooorm/retext-double-metaphone) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-double-metaphone.svg?style=flat)](https://coveralls.io/r/wooorm/retext-double-metaphone?branch=master)

**[Retext](https://github.com/wooorm/retext "Retext")** implementation of the [Double Metaphone](http://en.wikipedia.org/wiki/metaphone) algorithm.

## Installation

npm:
```sh
$ npm install retext-double-metaphone
```

Component:
```sh
$ component install wooorm/retext-double-metaphone
```

Bower:
```sh
$ bower install retext-double-metaphone
```

## Usage

```js
var Retext = require('retext'),
    visit = require('retext-visit'),
    doubleMetaphone = require('retext-double-metaphone'),
    retext;

retext = new Retext()
    .use(visit)
    .use(doubleMetaphone);

retext.parse('A simple english sentence.', function (err, tree) {
    tree.visitType(tree.WORD_NODE, function (node) {
        console.log(node.toString(), node.data.phonetics);
    });
    // 'A', [ 'A', 'A' ]
    // 'simple', [ 'SMPL', 'SMPL' ]
    // 'english', [ 'ANKLX', 'ANLX' ]
    // 'sentence', [ 'SNTNS', 'SNTNS' ]
});
```

You can also combine it with a stemmer (such as [retext-porter-stemmer](https://github.com/wooorm/retext-porter-stemmer), [retext-lancaster-stemmer](https://github.com/wooorm/retext-lancaster-stemmer)).

```js
var Retext = require('retext'),
    visit = require('retext-visit'),
    doubleMetaphone = require('retext-double-metaphone'),
    stemmer = require('retext-porter-stemmer'),
    retext;

retext = new Retext()
    .use(visit)
    .use(doubleMetaphone)
    .use(stemmer);

retext.parse('A detestable paragraph', function (err, tree) {
    tree.visitType(tree.WORD_NODE, function (node) {
        console.log(node.toString(), node.data.phonetics, node.data.stemmedPhonetics);
    });
    // 'A', [ 'A', 'A' ], [ 'A', 'A' ]
    // 'detestable', [ 'TTSTPL', 'TTSTPL' ], [ 'TTST', 'TTST' ]
    // 'paragraph', [ 'PRKRF', 'PRKRF' ], [ 'PRKRF', 'PRKRF' ]
});
```

## API

None, the plugin automatically detects the phonetics of each word (using [wooorm/double-metaphone](https://github.com/wooorm/double-metaphone)) when it’s created or changed, and stores the phonetics in `wordNode.data.phonetics`.

## License

MIT © Titus Wormer
