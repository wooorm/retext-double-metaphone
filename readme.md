# retext-double-metaphone [![Build Status](https://img.shields.io/travis/wooorm/retext-double-metaphone.svg)](https://travis-ci.org/wooorm/retext-double-metaphone) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/retext-double-metaphone.svg)](https://codecov.io/github/wooorm/retext-double-metaphone?branch=master)

[**Retext**](https://github.com/wooorm/retext) implementation of the
[Double Metaphone](http://en.wikipedia.org/wiki/metaphone) algorithm.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install retext-double-metaphone
```

**retext-double-metaphone** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), and
[duo](http://duojs.org/#getting-started), and as an AMD, CommonJS, and globals
module, [uncompressed](retext-double-metaphone.js) and
[compressed](retext-double-metaphone.min.js).

## Usage

```javascript
var retext = require('retext');
var inspect = require('unist-util-inspect');
var doubleMetaphone = require('retext-double-metaphone');

retext().use(doubleMetaphone).use(function () {
    return function (cst) {
        console.log(inspect(cst));
    };
}).process('A simple English sentence.');
```

Yields:

```text
RootNode[1]
└─ ParagraphNode[1]
   └─ SentenceNode[8]
      ├─ WordNode[1] [data={"phonetics":["A","A"]}]
      │  └─ TextNode: 'A'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"phonetics":["SMPL","SMPL"]}]
      │  └─ TextNode: 'simple'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"phonetics":["ANKLX","ANLX"]}]
      │  └─ TextNode: 'English'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"phonetics":["SNTNS","SNTNS"]}]
      │  └─ TextNode: 'sentence'
      └─ PunctuationNode: '.'
```

You can also combine it with a stemmer (such as [retext-porter-stemmer](https://github.com/wooorm/retext-porter-stemmer)
or [retext-lancaster-stemmer](https://github.com/wooorm/retext-lancaster-stemmer)).

```javascript
var retext = require('retext');
var inspect = require('unist-util-inspect');
var doubleMetaphone = require('retext-double-metaphone');
var stemmer = require('retext-porter-stemmer');

retext().use(stemmer).use(doubleMetaphone).use(function () {
    return function (cst) {
        console.log(inspect(cst));
    };
}).process('A simple English sentence.');
```

Yields:

```text
RootNode[1]
└─ ParagraphNode[1]
   └─ SentenceNode[6]
      ├─ WordNode[1] [data={"stem":"a","phonetics":["A","A"],"stemmedPhonetics":["A","A"]}]
      │  └─ TextNode: 'A'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"stem":"detest","phonetics":["TTSTPL","TTSTPL"],"stemmedPhonetics":["TTST","TTST"]}]
      │  └─ TextNode: 'detestable'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"stem":"paragraph","phonetics":["PRKRF","PRKRF"],"stemmedPhonetics":["PRKRF","PRKRF"]}]
      │  └─ TextNode: 'paragraph'
      └─ PunctuationNode: '.'
```

## API

None, **retext-double-metaphone** automatically detects the phonetics of each
[`WordNode`](https://github.com/wooorm/nlcst#wordnode) (using [**wooorm/double-metaphone**](https://github.com/wooorm/double-metaphone)),
and stores the phonetics in `node.data.phonetics`. If a stemmer is used,
the stemmed phonetics are stored in `node.data.stemmedPhonetics`.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
