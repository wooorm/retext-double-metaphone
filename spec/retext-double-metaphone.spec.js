'use strict';

var doubleMetaphone, stemmer, visit, Retext, assert,
    tree, stemmedTree, otherWords, otherPhonetics, stemmedOtherPhonetics;

doubleMetaphone = require('..');
Retext = require('retext');
visit = require('retext-visit');
stemmer = require('retext-porter-stemmer');
assert = require('assert');

tree = new Retext()
    .use(visit)
    .use(doubleMetaphone)
    .parse('A simple, english, sentence');

stemmedTree = new Retext()
    .use(visit)
    .use(doubleMetaphone)
    .use(stemmer)
    .parse(tree.toString());

otherWords = ['A', 'detestable', 'vile', 'paragraph'];
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

describe('double-metaphone()', function () {
    it('should be of type `function`', function () {
        assert(typeof doubleMetaphone === 'function');
    });

    it('should process each `WordNode`', function () {
        tree.visitType(tree.WORD_NODE, function (wordNode) {
            assert('phonetics' in wordNode.data);
        });
    });

    it('should set each phonetics attribute to `null` when a WordNode (no ' +
        'longer?) has a value', function () {
            tree.visitType(tree.WORD_NODE, function (wordNode) {
                wordNode.fromString();
                assert(wordNode.data.phonetics === null);
            });
        }
    );

    it('should automatically reprocess `WordNode`s when their values change',
        function () {
            var iterator = -1;
            tree.visitType(tree.WORD_NODE, function (wordNode) {
                var phonetics;

                wordNode.fromString(otherWords[++iterator]);

                phonetics = wordNode.data.phonetics;

                assert(phonetics[0] === otherPhonetics[iterator][0]);
                assert(phonetics[1] === otherPhonetics[iterator][1]);
            });
        }
    );
});

describe('double-metaphone() with a stemmer', function () {
    it('should process stem in each `WordNode` if available', function () {
        stemmedTree.visitType(stemmedTree.WORD_NODE, function (wordNode) {
            assert('stemmedPhonetics' in wordNode.data);
        });
    });

    it('should set each stemmedPhonetics attribute to `null` when a ' +
        'WordNode (no longer?) has a value', function () {
            stemmedTree.visitType(stemmedTree.WORD_NODE, function (wordNode) {
                wordNode.fromString();
                assert(wordNode.data.stemmedPhonetics === null);
            });
        }
    );

    it('should automatically reprocess `WordNode`s stemmed phonetics when ' +
        'their values change', function () {
            var iterator = -1;
            stemmedTree.visitType(stemmedTree.WORD_NODE, function (wordNode) {
                var stemmedPhonetics;

                wordNode.fromString(otherWords[++iterator]);

                stemmedPhonetics = wordNode.data.stemmedPhonetics;

                assert(
                    stemmedPhonetics[0] === stemmedOtherPhonetics[iterator][0]
                );
                assert(
                    stemmedPhonetics[1] === stemmedOtherPhonetics[iterator][1]
                );
            });
        }
    );
});
