# retext-double-metaphone [![Build Status](https://img.shields.io/travis/wooorm/retext-double-metaphone.svg?style=flat)](https://travis-ci.org/wooorm/retext-double-metaphone) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-double-metaphone.svg?style=flat)](https://coveralls.io/r/wooorm/retext-double-metaphone?branch=master)

**[Retext](https://github.com/wooorm/retext)** implementation of the [Double Metaphone](http://en.wikipedia.org/wiki/metaphone) algorithm.

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
var Retext = require('retext');
var visit = require('retext-visit');
var inspect = require('retext-inspect');
var doubleMetaphone = require('retext-double-metaphone');

var retext = new Retext()
    .use(inspect)
    .use(visit)
    .use(doubleMetaphone);

retext.parse('A simple english sentence.', function (err, tree) {
    tree.visit(tree.WORD_NODE, function (node) {
        console.log(node);
    });
    /**
     * WordNode[1] [data={"phonetics":["A","A"]}]
     * └─ TextNode: 'A'
     * WordNode[1] [data={"phonetics":["SMPL","SMPL"]}]
     * └─ TextNode: 'simple'
     * WordNode[1] [data={"phonetics":["ANKLX","ANLX"]}]
     * └─ TextNode: 'english'
     * WordNode[1] [data={"phonetics":["SNTNS","SNTNS"]}]
     * └─ TextNode: 'sentence'
     */
});
```

You can also combine it with a stemmer (such as [retext-porter-stemmer](https://github.com/wooorm/retext-porter-stemmer), [retext-lancaster-stemmer](https://github.com/wooorm/retext-lancaster-stemmer)).

```js
var Retext = require('retext');
var visit = require('retext-visit');
var inspect = require('retext-inspect');
var doubleMetaphone = require('retext-double-metaphone');
var stemmer = require('retext-porter-stemmer');

var retext = new Retext()
    .use(inspect)
    .use(visit)
    .use(doubleMetaphone)
    /* make sure to attach the stemmer after metaphone. */
    .use(stemmer);

retext.parse('A detestable paragraph.', function (err, tree) {
    tree.visit(tree.WORD_NODE, function (node) {
        console.log(node);
    });
    /**
     * WordNode[1] [data={"stem":"a","phonetics":["A","A"],"stemmedPhonetics":["A","A"]}]
     * └─ TextNode: 'A'
     * WordNode[1] [data={"stem":"detest","phonetics":["TTSTPL","TTSTPL"],"stemmedPhonetics":["TTST","TTST"]}]
     * └─ TextNode: 'detestable'
     * WordNode[1] [data={"stem":"paragraph","phonetics":["PRKRF","PRKRF"],"stemmedPhonetics":["PRKRF","PRKRF"]}]
     * └─ TextNode: 'paragraph'
     */
});
```

## API

None, **retext-double-metaphone** automatically detects the phonetics of each [`WordNode`](https://github.com/wooorm/textom#textomwordnode-nlcstwordnode) (using **[wooorm/double-metaphone](https://github.com/wooorm/double-metaphone)**), and stores the phonetics in `node.data.phonetics`. If a stemmer is used, the stemmed phonetics are stored in `node.data.stemmedPhonetics`.

## Performance

On a MacBook Air, **retext** performs about 20% slower with **retext-double-metaphone**.

```
           retext w/o retext-double-metaphone
  217 op/s » A paragraph (5 sentences, 100 words)
   24 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)

           retext w/ retext-double-metaphone
  173 op/s » A paragraph (5 sentences, 100 words)
   16 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)
```

## License

MIT © [Titus Wormer](http://wooorm.com)
