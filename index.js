/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module retext:metaphone
 * @fileoverview Retext implementation of the Metaphone algorithm.
 */

'use strict';

/*
 * Dependencies.
 */

var algorithm = require('double-metaphone');
var visit = require('unist-util-visit');
var nlcstToString = require('nlcst-to-string');

/**
 * Patch a `phonetics` property on `node` (a word-node).
 * When a `stem` property is available on the node’s data
 * object, a `stemmedPhonetics` is added on the data
 * as well.
 *
 * @param {NLCSTWordNode} node - Node.
 */
function patch(node) {
    var data = node.data || {};
    var value = nlcstToString(node);

    data.phonetics = algorithm(value);

    if ('stem' in data) {
        data.stemmedPhonetics = algorithm(data.stem);
    }

    node.data = data;
}

/**
 * Patch `stem` on each node.
 *
 * @param {NLCSTNode} cst - Syntax tree.
 */
function transformer(cst) {
    visit(cst, 'WordNode', patch);
}

/**
 * Define `metaphone`.
 *
 * @return {Function} - `transformer`.
 */
function attacher() {
    return transformer;
}

/*
 * Expose `metaphone`.
 */

module.exports = attacher;
