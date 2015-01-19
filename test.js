'use strict';

/*
 * Dependencies.
 */

var Retext,
    doubleMetaphone,
    stemmer,
    inspect,
    content,
    visit,
    assert;

Retext = require('retext');
doubleMetaphone = require('./');
stemmer = require('retext-porter-stemmer');
inspect = require('retext-inspect');
content = require('retext-content');
visit = require('retext-visit');
assert = require('assert');

/*
 * Retext.
 */

var retext,
    retextWithStemmer;

retext = new Retext()
    .use(inspect)
    .use(doubleMetaphone)
    .use(visit)
    .use(content);

retextWithStemmer = new Retext()
    .use(inspect)
    .use(doubleMetaphone)
    .use(stemmer)
    .use(visit)
    .use(content);

/*
 * Fixtures.
 */

var sentence,
    words,
    otherPhonetics,
    stemmedOtherPhonetics;

sentence = 'A simple, English, sentence.';

words = ['A', 'detestable', 'vile', 'paragraph'];

otherPhonetics = [
    ['A', 'A'],
    ['TTSTPL', 'TTSTPL'],
    ['FL', 'FL'],
    ['PRKRF', 'PRKRF']
];

stemmedOtherPhonetics = [
    ['A', 'A'],
    ['TTST', 'TTST'],
    ['FL', 'FL'],
    ['PRKRF', 'PRKRF']
];

/*
 * Tests.
 */

describe('double-metaphone()', function () {
    it('should be a `function`', function () {
        assert(typeof doubleMetaphone === 'function');
    });

    retext.parse(sentence, function (err, tree) {
        it('should not throw', function (done) {
            done(err);
        });

        it('should process each `WordNode`', function () {
            tree.visit(tree.WORD_NODE, function (node) {
                assert('phonetics' in node.data);
            });
        });

        it('should set `phonetics` to `null` when `WordNode` (no ' +
            'longer?) has a value',
            function () {
                tree.visit(tree.WORD_NODE, function (node) {
                    node.removeContent();

                    assert(node.data.phonetics === null);
                });
            }
        );

        it('should re-process `WordNode`s when their value changes',
            function () {
                var index;

                index = -1;

                tree.visit(tree.WORD_NODE, function (node) {
                    var phonetics;

                    index++;

                    node.replaceContent(words[index]);

                    phonetics = node.data.phonetics;

                    assert(phonetics[0] === otherPhonetics[index][0]);
                    assert(phonetics[1] === otherPhonetics[index][1]);
                });
            }
        );
    });
});

describe('double-metaphone() with a stemmer', function () {
    retextWithStemmer.parse(sentence, function (err, tree) {
        it('should not throw', function (done) {
            done(err);
        });

        it('should process `stem` in each `WordNode`', function () {
            tree.visit(tree.WORD_NODE, function (node) {
                assert('stemmedPhonetics' in node.data);
            });
        });

        it('should set `stemmedPhonetics` to `null` when `WordNode` (no ' +
            'longer?) has a value',
            function () {
                tree.visit(tree.WORD_NODE, function (node) {
                    node.removeContent();

                    assert(node.data.stemmedPhonetics === null);
                });
            }
        );

        it('should re-process `WordNode`s when their stem changes',
            function () {
                var index;

                index = -1;

                tree.visit(tree.WORD_NODE, function (node) {
                    var stemmedPhonetics;

                    index++;

                    node.replaceContent(words[index]);

                    stemmedPhonetics = node.data.stemmedPhonetics;

                    assert(
                        stemmedPhonetics[0] ===
                        stemmedOtherPhonetics[index][0]
                    );

                    assert(
                        stemmedPhonetics[1] ===
                        stemmedOtherPhonetics[index][1]
                    );
                });
            }
        );
    });
});
