'use strict';

exports = module.exports = function () {};

var doubleMetaphone = require('double-metaphone');

function onchange() {
    var data = this.data,
        value = this.toString();

    data.phonetics = value ? doubleMetaphone(value) : null;

    if ('stem' in data) {
        data.stemmedPhonetics = value ? doubleMetaphone(data.stem) : null;
    }
}

function attach(retext) {
    retext.parser.TextOM.WordNode.on('changetextinside', onchange);
    retext.parser.TextOM.WordNode.on('removeinside', onchange);
    retext.parser.TextOM.WordNode.on('insertinside', onchange);
}

exports.attach = attach;
