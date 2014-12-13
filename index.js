/**
 * Dependencies.
 */

var Retext = require('wooorm/retext@0.5.0-rc.1');
var doubleMetaphone = require('wooorm/retext-double-metaphone@0.1.6');
var stemmer = require('wooorm/retext-porter-stemmer@0.2.3');
var dom = require('wooorm/retext-dom@0.3.0');
var visit = require('wooorm/retext-visit@0.2.3');

/**
 * Retext.
 */

var retext = new Retext()
    .use(visit)
    .use(dom)
    .use(doubleMetaphone)
    .use(stemmer);

/**
 * DOM elements.
 */

var $input = document.getElementsByTagName('textarea')[0];
var $output = document.getElementsByTagName('div')[0];
var $stem = document.getElementsByTagName('input')[0];

/**
 * Get a color representation from a string.
 */

var style = document.styleSheets[0];

var phonetics = {};

function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToARGB(i){
    return ((i>>24)&0xFF).toString(16) +
           ((i>>16)&0xFF).toString(16) +
           ((i>>8)&0xFF).toString(16) +
           (i&0xFF).toString(16);
}

function getColorFromString(value) {
    value = intToARGB(hashCode(value)).slice(0, 6);

    while (value.length < 6) {
        value = '0' + value;
    }

    return '#' + value;
}

/**
 * Add a CSS rule.
 */

function addCSSRule(sheet, selector, rules) {
    if(sheet.insertRule) {
        sheet.insertRule(selector + '{' + rules + '}');
    } else {
        sheet.addRule(selector, rules);
    }
}

/**
 * Callback when new phonetics are calculated.
 */

function onphonetics(phonetic) {
    var color;

    if (phonetic in phonetics) {
        return;
    }

    color = getColorFromString(phonetic)
    phonetics[phonetic] = color;

    addCSSRule(style, '[data-phonetics="' + phonetic + '"]', 'color:' + color);
    addCSSRule(style, '[data-secondary-phonetics="' + phonetic + '"]', 'border-bottom-color:' + color);
}

/**
 * Events
 */

var shouldUseStemmedPhonetics = $stem.checked;

function onshouldstemchange() {
    shouldUseStemmedPhonetics = $stem.checked;

    oninputchange();
}

var tree;

function oninputchange() {
    if (tree) {
        tree.toDOMNode().parentNode.removeChild(tree.toDOMNode());
    }

    retext.parse($input.value, function (err, root) {
        if (err) throw err;

        tree = root;

        tree.visit(function (node) {
            if (!node.DOMTagName || !node.data.phonetics) {
                return;
            }

            phonetic = node.data.phonetics;

            if (shouldUseStemmedPhonetics) {
                phonetic = node.data.stemmedPhonetics;
            }

            node.toDOMNode().setAttribute(
                'title', '["' + phonetic[0] + '", "' + phonetic[1] + '"]'
            );

            onphonetics(phonetic[0]);
            onphonetics(phonetic[1]);

            node.toDOMNode().setAttribute('data-phonetics', phonetic[0]);

            if (phonetic[0] !== phonetic[1]) {
                node.toDOMNode().setAttribute('data-secondary-phonetics', phonetic[1]);
            }


            node.toDOMNode().setAttribute('title', phonetic);
        });

        $output.appendChild(tree.toDOMNode());
    });
}

$input.addEventListener('input', oninputchange);
$stem.addEventListener('change', onshouldstemchange);

onshouldstemchange();
