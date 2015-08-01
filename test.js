'use strict';

/* eslint-env mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var retext = require('retext');
var nlcstToString = require('nlcst-to-string');
var visit = require('unist-util-visit');
var doubleMetaphone = require('./');

/*
 * Methods.
 */

var equal = assert.equal;
var dequal = assert.deepEqual;

/*
 * Fixtures.
 */

var sentence = 'A simple, English, sentence';

var phonetics = [
    ['A', 'A'],
    ['SMPL', 'SMPL'],
    ['ANKLX', 'ANLX'],
    ['SNTNS', 'SNTNS']
];

/**
 * Example stemmer, which expects the tree to equal `otherWord`.
 */
function stemmer() {
    return function (cst) {
        visit(cst, 'WordNode', function (node) {
            node.data = {
                'stem': nlcstToString(node)
            };
        });
    };
}

/*
 * Tests.
 */

describe('doubleMetaphone()', function () {
    var processor = retext.use(doubleMetaphone);

    it('should be of type `function`', function () {
        equal(typeof doubleMetaphone, 'function');
    });

    processor.process(sentence, function (e, file) {
        var cst = file.namespace('retext').cst;

        it('should not throw', function (done) {
            done(e);
        });

        it('should process each `WordNode`', function () {
            var index = -1;

            visit(cst, 'WordNode', function (node) {
                assert('phonetics' in node.data);
                dequal(node.data.phonetics, phonetics[++index]);
            });
        });
    });
});

describe('doubleMetaphone() with a stemmer', function () {
    var processor = retext.use(stemmer).use(doubleMetaphone);

    processor.process(sentence, function (e, file) {
        var cst = file.namespace('retext').cst;

        it('should not throw', function (done) {
            done(e);
        });

        it('should process `stem` in each `WordNode`', function () {
            visit(cst, 'WordNode', function (node) {
                dequal(node.data.stemmedPhonetics, node.data.phonetics);
            });
        });
    });
});
