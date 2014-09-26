'use strict';

/**
 * Dependencies.
 */

var phonetics;

phonetics = require('double-metaphone');

/**
 * Define `doubleMetaphone`.
 */

function doubleMetaphone() {}

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
 * Define `attach`.
 *
 * @param {Retext} retext
 */

function attach(retext) {
    var WordNode = retext.TextOM.WordNode;

    WordNode.on('changetextinside', onchange);
    WordNode.on('removeinside', onchange);
    WordNode.on('insertinside', onchange);
}

/**
 * Expose `attach`.
 */

doubleMetaphone.attach = attach;

/**
 * Expose `doubleMetaphone`.
 */

module.exports = doubleMetaphone;
