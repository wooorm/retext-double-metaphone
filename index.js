'use strict';

exports = module.exports = function () {};

var doubleMetaphone = require('double-metaphone');

function onchangetext(value) {
    var data = this.data;
    data.phonetics = value ? doubleMetaphone(value) : null;
    if ('stem' in data) {
        data.stemmedPhonetics = value ? doubleMetaphone(data.stem) : null;
    }
}

function attach(retext) {
    retext.parser.TextOM.WordNode.on('changetext', onchangetext);
}

exports.attach = attach;
