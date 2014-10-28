'use strict';

/**
 * Dependencies.
 */

var phonetics;

phonetics = require('double-metaphone');

/**
 * Change handler.
 *
 * @this {WordNode}
 */

function onchange() {
    var data,
        value;

    data = this.data;
    value = this.toString();

    data.phonetics = value ? phonetics(value) : null;

    if ('stem' in data) {
        data.stemmedPhonetics = value ? phonetics(data.stem) : null;
    }
}

/**
 * Define `doubleMetaphone`.
 *
 * @param {Retext} retext
 */

function doubleMetaphone(retext) {
    var WordNode = retext.TextOM.WordNode;

    WordNode.on('changetextinside', onchange);
    WordNode.on('removeinside', onchange);
    WordNode.on('insertinside', onchange);
}

/**
 * Expose `doubleMetaphone`.
 */

module.exports = doubleMetaphone;
