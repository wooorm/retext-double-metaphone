/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("wooorm~double-metaphone@0.1.1", function (exports, module) {
'use strict';

var VOWELS,
    SLAVO_GERMANIC,
    GERMANIC,
    INITIAL_EXCEPTIONS,
    GREEK_INITIAL_CH,
    GREEK_CH,
    CH_FOR_KH,
    G_FOR_F,
    INITIAL_G_FOR_KJ,
    INITIAL_ANGER_EXCEPTION,
    G_FOR_KJ,
    J_FOR_J_EXCEPTION,
    ALLE,
    H_FOR_S,
    DUTCH_SCH;

/**
 * Match vowels (including `Y`).
 */

VOWELS = /[AEIOUY]/;

/**
 * Match few Slavo-Germanic values.
 */

SLAVO_GERMANIC = /W|K|CZ|WITZ/;

/**
 * Match few Germanic values.
 */

GERMANIC = /^(VAN |VON |SCH)/;

/**
 * Match initial values of which the first character
 * should be skipped.
 */

INITIAL_EXCEPTIONS = /^(GN|KN|PN|WR|PS)/;

/**
 * Match initial Greek-like values of which the `CH`
 * sounds like `K`.
 */

GREEK_INITIAL_CH = /^CH(IA|EM|OR([^E])|YM|ARAC|ARIS)/;

/**
 * Match Greek-like values of which the `CH` sounds
 * like `K`.
 */

GREEK_CH = /ORCHES|ARCHIT|ORCHID/;

/**
 * Match values which when following `CH`, transform `CH`
 * to sound like `K`.
 */

CH_FOR_KH = /[ BFHLMNRVW]/;

/**
 * Match values which when preceding a vowel and `UGH`,
 * sound like `F`.
 */

G_FOR_F = /[CGLRT]/;

/**
 * Match initial values which sound like either `K` or `J`.
 */

INITIAL_G_FOR_KJ = /Y[\s\S]|E[BILPRSY]|I[BELN]/;

/**
 * Match initial values which sound like either `K` or `J`.
 */

INITIAL_ANGER_EXCEPTION = /^[DMR]ANGER/;

/**
 * Match values which when following `GY`, do not sound
 * like `K` or `J`.
 */

G_FOR_KJ = /[EGIR]/;

/**
 * Match values which when following `J`, do not sound `J`.
 */

J_FOR_J_EXCEPTION = /[LTKSNMBZ]/;

/**
 * Match values which might sound like `L`.
 */

ALLE = /AS|OS/;

/**
 * Match Germanic values preceding `SH` which sound
 * like `S`.
 */

H_FOR_S = /EIM|OEK|OLM|OLZ/;

/**
 * Match Dutch values following `SCH` which sound like
 * either `X` and `SK`, or `SK`.
 */

DUTCH_SCH = /E[DMNR]|UY|OO/;

/**
 * Get the phonetics according to the Double Metaphone
 * algorithm from a value.
 *
 * @param {string} value - value to detect phonetics for.
 * @return {string} phonetics.
 */

function doubleMetaphone(value) {
    var primary = '',
        secondary = '',
        index = 0,
        length = value.length,
        last = length - 1,
        isSlavoGermanic, isGermanic, subvalue, next, prev, nextnext,
        characters;

    value = String(value).toUpperCase() + '     ';
    isSlavoGermanic = SLAVO_GERMANIC.test(value);
    isGermanic = GERMANIC.test(value);
    characters = value.split('');

    /**
     * skip this at beginning of word.
     */

    if (INITIAL_EXCEPTIONS.test(value)) {
        index++;
    }

    /**
     * Initial X is pronounced Z, which maps to S. Such as `Xavier`
     */

    if (characters[0] === 'X') {
        primary += 'S';
        secondary += 'S';

        index++;
    }

    while (index < length) {
        prev = characters[index - 1];
        next = characters[index + 1];
        nextnext = characters[index + 2];

        switch (characters[index]) {
            case 'A':
            case 'E':
            case 'I':
            case 'O':
            case 'U':
            case 'Y':
            case 'À':
            case 'Ê':
            case 'É':
            case 'É':
                if (index === 0) {
                    /**
                     * All initial vowels now map to `A`.
                     */

                    primary += 'A';
                    secondary += 'A';
                }

                index++;

                break;
            case 'B':
                primary += 'P';
                secondary += 'P';

                if (next === 'B') {
                    index++;
                }

                index++;

                break;
            case 'Ç':
                primary += 'S';
                secondary += 'S';
                index++;

                break;
            case 'C':
                /**
                 * Various Germanic:
                 */

                if (prev === 'A' && next === 'H' && nextnext !== 'I' &&
                    !VOWELS.test(characters[index - 2]) &&
                    (
                        nextnext !== 'E' || (
                            subvalue = value.slice(index - 2, index + 4) &&
                            (subvalue === 'BACHER' || subvalue === 'MACHER')
                        )
                    )
                ) {
                    primary += 'K';
                    secondary += 'K';
                    index += 2;

                    break;
                }

                /**
                 * Special case for `Caesar`.
                 */

                if (
                    index === 0 &&
                    value.slice(index + 1, index + 6) === 'AESAR'
                ) {
                    primary += 'S';
                    secondary += 'S';
                    index += 2;

                    break;
                }

                /**
                 * Italian `Chianti`.
                 */

                if (value.slice(index + 1, index + 4) === 'HIA') {
                    primary += 'K';
                    secondary += 'K';
                    index += 2;

                    break;
                }

                if (next === 'H') {
                    /**
                     * Find `Michael`.
                     */

                    if (
                        index > 0 && nextnext === 'A' &&
                        characters[index + 3] === 'E'
                    ) {
                        primary += 'K';
                        secondary += 'X';
                        index += 2;

                        break;
                    }

                    /**
                     * Greek roots such as `chemistry`, `chorus`.
                     */

                    if (index === 0 && GREEK_INITIAL_CH.test(value)) {
                        primary += 'K';
                        secondary += 'K';
                        index += 2;

                        break;
                    }

                    /**
                     * Germanic, Greek, or otherwise `CH` for `KH` sound.
                     */

                    if (
                        isGermanic ||
                        /**
                         * Such as 'architect' but not 'arch', orchestra',
                         * 'orchid'.
                         */
                        GREEK_CH.test(value.slice(index - 2, index + 4)) ||
                        (nextnext === 'T' || nextnext === 'S') ||
                        (
                            (
                                index === 0 ||
                                prev === 'A' || prev === 'E' ||
                                prev === 'O' || prev === 'U'
                            ) &&
                            /**
                             * Such as `wachtler`, `weschsler`, but not
                             * `tichner`.
                             */
                            CH_FOR_KH.test(nextnext)
                        )
                    ) {
                        primary += 'K';
                        secondary += 'K';
                    } else if (index === 0) {
                        primary += 'X';
                        secondary += 'X';
                    /**
                     * Such as 'McHugh'.
                     */
                    } else if (value.slice(0, 2) === 'MC') {
                        /**
                         * Bug? Why matching absolute? what about McHiccup?
                         */

                        primary += 'K';
                        secondary += 'K';
                    } else {
                        primary += 'X';
                        secondary += 'K';
                    }

                    index += 2;

                    break;
                }

                /**
                 * Such as `Czerny`.
                 */

                if (
                    next === 'Z' &&
                    value.slice(index - 2, index) !== 'WI'
                ) {
                    primary += 'S';
                    secondary += 'X';
                    index += 2;

                    break;
                }

                /**
                 * Such as `Focaccia`.
                 */

                if (value.slice(index + 1, index + 4) === 'CIA') {
                    primary += 'X';
                    secondary += 'X';
                    index += 3;

                    break;
                }

                /**
                 * Double `C`, but not `McClellan`.
                 */

                if (
                    next === 'C' &&
                    !(index === 1 && characters[0] === 'M')
                ) {
                    /**
                     * Such as `Bellocchio`, but not `Bacchus`.
                     */

                    if (
                        (
                            nextnext === 'I' ||
                            nextnext === 'E' ||
                            nextnext === 'H'
                        ) &&
                        value.slice(index + 2, index + 4) !== 'HU'
                    ) {
                        subvalue = value.slice(index - 1, index + 4);

                        /**
                         * Such as `Accident`, `Accede`, `Succeed`.
                         */

                        if (
                            (index === 1 && prev === 'A') ||
                            subvalue === 'UCCEE' || subvalue === 'UCCES'
                        ) {
                            primary += 'KS';
                            secondary += 'KS';

                        /**
                         * Such as `Bacci`, `Bertucci`, other Italian.
                         */
                        } else {
                            primary += 'X';
                            secondary += 'X';
                        }

                        index += 3;

                        break;
                    } else {
                        /**
                         * Pierce's rule.
                         */

                        primary += 'K';
                        secondary += 'K';
                        index += 2;

                        break;
                    }
                }

                if (next === 'G' || next === 'K' || next === 'Q') {
                    primary += 'K';
                    secondary += 'K';
                    index += 2;

                    break;
                }

                /**
                 * Italian.
                 */

                if (
                    next === 'I' &&
                    /**
                     * Bug: The original algorithm also calls for A (as
                     * in CIA), which is already taken care of above.
                     */
                    (nextnext === 'E' || nextnext === 'O')
                ) {
                    primary += 'S';
                    secondary += 'X';
                    index += 2;

                    break;
                }

                if (next === 'I' || next === 'E' || next === 'Y') {
                    primary += 'S';
                    secondary += 'S';
                    index += 2;

                    break;
                }

                primary += 'K';
                secondary += 'K';

                /**
                 * Skip two extra characters ahead in `Mac Caffrey`,
                 * `Mac Gregor`.
                 */

                if (
                    next === ' ' &&
                    (
                        nextnext === 'C' ||
                        nextnext === 'G' ||
                        nextnext === 'Q'
                    )
                ) {
                    index += 3;
                    break;
                }

                /**
                 * Bug: Already covered above.
                 *
                 * if (
                 *     next === 'K' ||
                 *     next === 'Q' ||
                 *     (
                 *         next === 'C' &&
                 *         nextnext !== 'E' &&
                 *         nextnext !== 'I'
                 *     )
                 * ) {
                 *     index++;
                 * }
                 */

                index++;

                break;
            case 'D':
                if (next === 'G') {
                    /**
                     * Such as `edge`.
                     */

                    if (
                        nextnext === 'E' ||
                        nextnext === 'I' ||
                        nextnext === 'Y'
                    ) {
                        primary += 'J';
                        secondary += 'J';
                        index += 3;
                    /**
                     * Such as `Edgar`.
                     */
                    } else {
                        primary += 'TK';
                        secondary += 'TK';
                        index += 2;
                    }

                    break;
                }

                if (next === 'T' || next === 'D') {
                    primary += 'T';
                    secondary += 'T';
                    index += 2;

                    break;
                }

                primary += 'T';
                secondary += 'T';
                index++;

                break;
            case 'F':
                if (next === 'F') {
                    index++;
                }

                index++;
                primary += 'F';
                secondary += 'F';

                break;
            case 'G':
                if (next === 'H') {
                    if (index > 0 && !VOWELS.test(prev)) {
                        primary += 'K';
                        secondary += 'K';
                        index += 2;

                        break;
                    }

                    /**
                     * Such as `Ghislane`, `Ghiradelli`.
                     */

                    if (index === 0) {
                        if (nextnext === 'I') {
                            primary += 'J';
                            secondary += 'J';
                        } else {
                            primary += 'K';
                            secondary += 'K';
                        }
                        index += 2;
                        break;
                    }

                    /**
                     * Parker's rule (with some further refinements).
                     */

                    if (
                        (
                            /**
                             * Such as `Hugh`
                             *
                             * The comma is not a bug.
                             */

                            subvalue = characters[index - 2],
                            subvalue === 'B' ||
                            subvalue === 'H' ||
                            subvalue === 'D'
                        ) ||
                        (
                            /**
                             * Such as `bough`.
                             *
                             * The comma is not a bug.
                             */

                            subvalue = characters[index - 3],
                            subvalue === 'B' ||
                            subvalue === 'H' ||
                            subvalue === 'D'
                        ) ||
                        (
                            /**
                             * Such as `Broughton`.
                             *
                             * The comma is not a bug.
                             */

                            subvalue = characters[index - 4],
                            subvalue === 'B' ||
                            subvalue === 'H'
                        )
                    ) {
                        index += 2;

                        break;
                    }

                    /**
                     * Such as `laugh`, `McLaughlin`, `cough`, `gough`,
                     * `rough`, `tough`.
                     */

                    if (
                        index > 2 && prev === 'U' &&
                        G_FOR_F.test(characters[index - 3])
                    ) {
                        primary += 'F';
                        secondary += 'F';
                    } else if (index > 0 && prev !== 'I') {
                        primary += 'K';
                        secondary += 'K';
                    }

                    index += 2;

                    break;
                }

                if (next === 'N') {
                    if (
                        index === 1 &&
                        VOWELS.test(characters[0]) &&
                        !isSlavoGermanic
                    ) {
                        primary += 'KN';
                        secondary += 'N';
                    /**
                     * Not like `Cagney`.
                     */
                    } else if (
                        value.slice(index + 2, index + 4) !== 'EY' &&
                        value.slice(index + 1) !== 'Y' &&
                        !isSlavoGermanic
                    ) {
                        primary += 'N';
                        secondary += 'KN';
                    } else {
                        primary += 'KN';
                        secondary += 'KN';
                    }

                    index += 2;

                    break;
                }

                /**
                 * Such as `Tagliaro`.
                 */

                if (
                    value.slice(index + 1, index + 3) === 'LI' &&
                    !isSlavoGermanic
                ) {
                    primary += 'KL';
                    secondary += 'L';
                    index += 2;

                    break;
                }

                /**
                 * -ges-, -gep-, -gel- at beginning.
                 */

                if (
                    index === 0 &&
                    INITIAL_G_FOR_KJ.test(value.slice(1, 3))
                ) {
                    primary += 'K';
                    secondary += 'J';
                    index += 2;

                    break;
                }

                /**
                 * -ger-, -gy-.
                 */

                if (
                    (
                        value.slice(index + 1, index + 3) === 'ER' &&
                        prev !== 'I' && prev !== 'E' &&
                        !INITIAL_ANGER_EXCEPTION.test(value.slice(0, 6))
                    ) ||
                    (next === 'Y' && !G_FOR_KJ.test(prev))
                ) {
                    primary += 'K';
                    secondary += 'J';
                    index += 2;

                    break;
                }

                /**
                 * Italian such as `biaggi`.
                 */

                if (
                    next === 'E' || next === 'I' || next === 'Y' ||
                    (
                        (prev === 'A' || prev === 'O') &&
                        next === 'G' && nextnext === 'I'
                    )
                ) {
                    /**
                     * Obvious Germanic.
                     */

                    if (
                        value.slice(index + 1, index + 3) === 'ET' ||
                        isGermanic
                    ) {
                        primary += 'K';
                        secondary += 'K';
                    } else {
                        /**
                         * Always soft if French ending.
                         */

                        if (value.slice(index + 1, index + 5) === 'IER ') {
                            primary += 'J';
                            secondary += 'J';
                        } else {
                            primary += 'J';
                            secondary += 'K';
                        }
                    }

                    index += 2;

                    break;
                }

                if (next === 'G') {
                    index++;
                }

                index++;

                primary += 'K';
                secondary += 'K';

                break;
            case 'H':
                /**
                 * Only keep if first & before vowel or btw. 2 vowels.
                 */

                if (VOWELS.test(next) && (index === 0 || VOWELS.test(prev))) {
                    primary += 'H';
                    secondary += 'H';

                    index++;
                }

                index++;

                break;
            case 'J':
                /**
                 * Obvious Spanish, `jose`, `San Jacinto`.
                 */
                if (
                    value.slice(index, index + 4) === 'JOSE' ||
                    value.slice(0, 4) === 'SAN '
                ) {
                    if (
                        value.slice(0, 4) === 'SAN ' ||
                        (
                            index === 0 &&
                            characters[index + 4] === ' '
                        )
                    ) {
                        primary += 'H';
                        secondary += 'H';
                    } else {
                        primary += 'J';
                        secondary += 'H';
                    }

                    index++;

                    break;
                }

                if (
                    index === 0
                    /**
                     * Bug: unreachable (see previous statement).
                     * && value.slice(index, index + 4) !== 'JOSE'.
                     */
                ) {
                    primary += 'J';

                    /**
                     * Such as `Yankelovich` or `Jankelowicz`.
                     */

                    secondary += 'A';
                /**
                 * Spanish pron. of such as `bajador`.
                 */
                } else if (
                    !isSlavoGermanic &&
                    (next === 'A' || next === 'O') &&
                    VOWELS.test(prev)
                ) {
                    primary += 'J';
                    secondary += 'H';
                } else if (index === last) {
                    primary += 'J';
                } else if (
                    prev !== 'S' && prev !== 'K' && prev !== 'L' &&
                    !J_FOR_J_EXCEPTION.test(next)
                ) {
                    primary += 'J';
                    secondary += 'J';
                /**
                 * It could happen.
                 */
                } else if (next === 'J') {
                    index++;
                }

                index++;

                break;
            case 'K':
                if (next === 'K') {
                    index++;
                }

                primary += 'K';
                secondary += 'K';
                index++;

                break;
            case 'L':
                if (next === 'L') {
                    /**
                     * Spanish such as `cabrillo`, `gallegos`.
                     */

                    if (
                        (
                            index === length - 3 &&
                            (
                                (
                                    prev === 'I' &&
                                    (nextnext === 'O' || nextnext === 'A')
                                ) ||
                                (
                                    prev === 'A' &&
                                    nextnext === 'E'
                                )
                            )
                        ) || (
                            prev === 'A' && nextnext === 'E' &&
                            (
                                (
                                    characters[last] === 'A' ||
                                    characters[last] === 'O'
                                ) ||
                                ALLE.test(value.slice(last - 1, length))
                            )
                        )
                    ) {
                        primary += 'L';
                        index += 2;

                        break;
                    }

                    index++;
                }

                primary += 'L';
                secondary += 'L';
                index++;

                break;
            case 'M':
                if (
                    next === 'M' ||

                    /**
                     * Such as `dumb`, `thumb`.
                     */

                    (
                        prev === 'U' && next === 'B' &&
                        (
                            index + 1 === last ||
                            value.slice(index + 2, index + 4) === 'ER'
                        )
                    )
                ) {
                    index++;
                }

                index++;
                primary += 'M';
                secondary += 'M';

                break;
            case 'N':
                if (next === 'N') {
                    index++;
                }

                index++;
                primary += 'N';
                secondary += 'N';

                break;
            case 'Ñ':
                index++;
                primary += 'N';
                secondary += 'N';

                break;
            case 'P':
                if (next === 'H') {
                    primary += 'F';
                    secondary += 'F';
                    index += 2;

                    break;
                }

                /**
                 * Also account for `campbell` and `raspberry`.
                 */

                subvalue = next;

                if (subvalue === 'P' || subvalue === 'B') {
                    index++;
                }

                index++;

                primary += 'P';
                secondary += 'P';

                break;
            case 'Q':
                if (next === 'Q') {
                    index++;
                }

                index++;
                primary += 'K';
                secondary += 'K';

                break;
            case 'R':
                /**
                 * French such as `Rogier`, but exclude `Hochmeier`.
                 */

                if (
                    index === last &&
                    !isSlavoGermanic &&
                    prev === 'E' &&
                    characters[index - 2] === 'I' &&
                    characters[index - 4] !== 'M' &&
                    (
                        characters[index - 3] !== 'E' &&
                        characters[index - 3] !== 'A'
                    )
                ) {
                    secondary += 'R';
                } else {
                    primary += 'R';
                    secondary += 'R';
                }

                if (next === 'R') {
                    index++;
                }

                index++;

                break;
            case 'S':
                /**
                 * Special cases `island`, `isle`, `carlisle`, `carlysle`.
                 */

                if (next === 'L' && (prev === 'I' || prev === 'Y')) {
                    index++;

                    break;
                }

                /**
                 * Special case `sugar-`.
                 */

                if (index === 0 && value.slice(1, 5) === 'UGAR') {
                    primary += 'X';
                    secondary += 'S';
                    index++;

                    break;
                }

                if (next === 'H') {
                    /**
                     * Germanic.
                     */

                    if (H_FOR_S.test(value.slice(index + 1, index + 5))) {
                        primary += 'S';
                        secondary += 'S';
                    } else {
                        primary += 'X';
                        secondary += 'X';
                    }

                    index += 2;
                    break;
                }

                if (
                    next === 'I' && (nextnext === 'O' || nextnext === 'A')
                    /**
                     * Bug: Already covered by previous branch
                     * || value.slice(index, index + 4) === 'SIAN'
                     */
                ) {
                    if (!isSlavoGermanic) {
                        primary += 'S';
                        secondary += 'X';
                    } else {
                        primary += 'S';
                        secondary += 'S';
                    }

                    index += 3;

                    break;
                }

                /**
                 * German & Anglicization's, such as `Smith` match `Schmidt`,
                 * `snider` match `Schneider`. Also, -sz- in slavic language
                 * although in hungarian it is pronounced `s`.
                 */

                if (
                    next === 'Z' ||
                    (
                        index === 0 && (
                            next === 'L' || next === 'M' ||
                            next === 'N' || next === 'W'
                        )
                    )
                ) {
                    primary += 'S';
                    secondary += 'X';

                    if (next === 'Z') {
                        index++;
                    }

                    index++;

                    break;
                }

                if (next === 'C') {
                    /**
                     * Schlesinger's rule.
                     */

                    if (nextnext === 'H') {
                        subvalue = value.slice(index + 3, index + 5);

                        /**
                         * Dutch origin, such as `school`, `schooner`.
                         */

                        if (DUTCH_SCH.test(subvalue)) {
                            /**
                             * Such as `schermerhorn`, `schenker`.
                             */

                            if (subvalue === 'ER' || subvalue === 'EN') {
                                primary += 'X';
                                secondary += 'SK';
                            } else {
                                primary += 'SK';
                                secondary += 'SK';
                            }

                            index += 3;

                            break;
                        }

                        if (
                            index === 0 &&
                            !VOWELS.test(characters[3]) &&
                            characters[3] !== 'W'
                        ) {
                            primary += 'X';
                            secondary += 'S';
                        } else {
                            primary += 'X';
                            secondary += 'X';
                        }

                        index += 3;

                        break;
                    }

                    if (
                        nextnext === 'I' ||
                        nextnext === 'E' ||
                        nextnext === 'Y'
                    ) {
                        primary += 'S';
                        secondary += 'S';
                        index += 3;
                        break;
                    }

                    primary += 'SK';
                    secondary += 'SK';
                    index += 3;

                    break;
                }

                subvalue = value.slice(index - 2, index);

                /**
                 * French such as `resnais`, `artois`.
                 */

                if (
                    index === last &&
                    (
                        subvalue === 'AI' ||
                        subvalue === 'OI'
                    )
                ) {
                    secondary += 'S';
                } else {
                    primary += 'S';
                    secondary += 'S';
                }

                if (
                    next === 'S'
                    /**
                     * Bug: already taken care of by `German &
                     * Anglicization's` above:
                     *
                     * || next === 'Z'
                     */
                ) {
                    index++;
                }

                index++;

                break;
            case 'T':
                if (
                    next === 'I' &&
                    nextnext === 'O' &&
                    characters[index + 3] === 'N'
                ) {
                    primary += 'X';
                    secondary += 'X';
                    index += 3;

                    break;
                }

                subvalue = value.slice(index + 1, index + 3);

                if (
                    (
                        next === 'I' &&
                        nextnext === 'A'
                    ) || (
                        next === 'C' &&
                        nextnext === 'H'
                    )
                ) {
                    primary += 'X';
                    secondary += 'X';
                    index += 3;

                    break;
                }

                if (next === 'H' || (next === 'T' && nextnext === 'H')) {
                    /**
                     * Special case `Thomas`, `Thames` or Germanic.
                     */

                    if (
                        isGermanic ||
                        (
                            (nextnext === 'O' || nextnext === 'A') &&
                            characters[index + 3] === 'M'
                        )
                    ) {
                        primary += 'T';
                        secondary += 'T';
                    } else {
                        primary += '0';
                        secondary += 'T';
                    }

                    index += 2;

                    break;
                }

                if (next === 'T' || next === 'D') {
                    index++;
                }

                index++;
                primary += 'T';
                secondary += 'T';

                break;
            case 'V':
                if (next === 'V') {
                    index++;
                }

                primary += 'F';
                secondary += 'F';
                index++;

                break;
            case 'W':
                /**
                 * Can also be in middle of word (as already taken care of
                 * for initial).
                 */

                if (next === 'R') {
                    primary += 'R';
                    secondary += 'R';
                    index += 2;

                    break;
                }

                if (index === 0) {
                    /**
                     * `Wasserman` should match `Vasserman`.
                     */

                    if (VOWELS.test(next)) {
                        primary += 'A';
                        secondary += 'F';
                    } else if (next === 'H') {
                        /**
                         * Need `Uomo` to match `Womo`.
                         */

                        primary += 'A';
                        secondary += 'A';
                    }
                }

                /**
                 * `Arnow` should match `Arnoff`.
                 */

                if (
                    (
                        (prev === 'E' || prev === 'O') &&
                        next === 'S' && nextnext === 'K' &&
                        (
                            characters[index + 3] === 'I' ||
                            characters[index + 3] === 'Y'
                        )
                    ) ||
                    /**
                     * Maybe a bug? Shouldn't this be general Germanic?
                     */

                    value.slice(0, 3) === 'SCH' ||
                    (index === last && VOWELS.test(prev))
                ) {
                    secondary += 'F';
                    index++;

                    break;
                }

                /**
                 * Polish such as `Filipowicz`.
                 */

                if (
                    next === 'I' &&
                    (nextnext === 'C' || nextnext === 'T') &&
                    characters[index + 3] === 'Z'
                ) {
                    primary += 'TS';
                    secondary += 'FX';
                    index += 4;

                    break;
                }

                index++;

                break;
            case 'X':
                /**
                 * French such as `breaux`.
                 */

                if (
                    index === last ||
                    (
                        /**
                         * Bug: IAU and EAU also match by AU
                         * /IAU|EAU/.test(value.slice(index - 3, index)) ||
                         */
                        prev === 'U' &&
                        (
                            characters[index - 2] === 'A' ||
                            characters[index - 2] === 'O'
                        )
                    )
                ) {
                    primary += 'KS';
                    secondary += 'KS';
                }

                if (next === 'C' || next === 'X') {
                    index++;
                }

                index++;

                break;
            case 'Z':
                /**
                 * Chinese pinyin such as `Zhao`.
                 */

                if (next === 'H') {
                    primary += 'J';
                    secondary += 'J';
                    index += 2;

                    break;
                } else if (
                    (
                        next === 'Z' &&
                        (
                            nextnext === 'A' || nextnext === 'I' ||
                            nextnext === 'O'
                        )
                    ) ||
                    (isSlavoGermanic && index > 0 && prev !== 'T')
                ) {
                    primary += 'S';
                    secondary += 'TS';
                } else {
                    primary += 'S';
                    secondary += 'S';
                }

                if (next === 'Z') {
                    index++;
                }

                index++;

                break;
            default:
                index++;

        }
    }

    return [primary, secondary];
}

/**
 * Expose `doubleMetaphone`.
 */

module.exports = doubleMetaphone;

});

require.register("wooorm~retext-double-metaphone@0.1.1", function (exports, module) {
'use strict';

/**
 * Dependencies.
 */

var phonetics;

phonetics = require("wooorm~double-metaphone@0.1.1");

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

});

require.register("wooorm~parse-latin@0.1.3", function (exports, module) {
/**!
 * parse-latin
 *
 * Licensed under MIT.
 * Copyright (c) 2014 Titus Wormer <tituswormer@gmail.com>
 */
'use strict';

var EXPRESSION_ABBREVIATION_PREFIX, EXPRESSION_NEW_LINE,
    EXPRESSION_MULTI_NEW_LINE,
    EXPRESSION_AFFIX_PUNCTUATION, EXPRESSION_INNER_WORD_PUNCTUATION,
    EXPRESSION_INITIAL_WORD_PUNCTUATION, EXPRESSION_FINAL_WORD_PUNCTUATION,
    EXPRESSION_LOWER_INITIAL_EXCEPTION,
    EXPRESSION_NUMERICAL, EXPRESSION_TERMINAL_MARKER,
    GROUP_ALPHABETIC, GROUP_ASTRAL, GROUP_CLOSING_PUNCTUATION,
    GROUP_COMBINING_DIACRITICAL_MARK, GROUP_COMBINING_NONSPACING_MARK,
    GROUP_FINAL_PUNCTUATION, GROUP_LETTER_LOWER, GROUP_NUMERICAL,
    GROUP_TERMINAL_MARKER, GROUP_WHITE_SPACE, GROUP_WORD,
    parseLatinPrototype;

/**
 * Expands a list of Unicode code points and ranges to be usable in an
 * expression.
 *
 * "Borrowed" from XRegexp.
 *
 * @param {string} value
 * @return {string}
 * @private
 */
function expand(value) {
    return value.replace(/\w{4}/g, '\\u$&');
}

/**
 * Expose Unicode Number Range (Nd, Nl, and No).
 *
 * "Borrowed" from XRegexp.
 *
 * @global
 * @private
 * @constant
 */
GROUP_NUMERICAL = expand(
    /*
     * Nd: Number, Decimal Digit
     */
    '0030-003900B200B300B900BC-00BE0660-066906F0-06F907C0-07C90966-096F' +
    '09E6-09EF09F4-09F90A66-0A6F0AE6-0AEF0B66-0B6F0B72-0B770BE6-0BF' +
    '20C66-0C6F0C78-0C7E0CE6-0CEF0D66-0D750E50-0E590ED0-0ED90F20-0F33' +
    '1040-10491090-10991369-137C16EE-16F017E0-17E917F0-17F91810-1819' +
    '1946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C49' +
    '1C50-1C5920702074-20792080-20892150-21822185-21892460-249B24EA-' +
    '24FF2776-27932CFD30073021-30293038-303A3192-31953220-32293248-324F' +
    '3251-325F3280-328932B1-32BFA620-A629A6E6-A6EFA830-A835A8D0-A8D9' +
    'A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19' +

    /*
     * Nl: Number, Letter
     */
    '16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF' +

    /*
     * No: Number, Other
     */
    '00B200B300B900BC-00BE09F4-09F90B72-0B770BF0-0BF20C78-0C7E0D70-0D75' +
    '0F2A-0F331369-137C17F0-17F919DA20702074-20792080-20892150-215F' +
    '21892460-249B24EA-24FF2776-27932CFD3192-31953220-32293248-324F' +
    '3251-325F3280-328932B1-32BFA830-A835'
);

/**
 * Expose Unicode Alphabetic category Ll (Letter, lowercase).
 *
 * "Borrowed" from XRegexp.
 *
 * @global
 * @private
 * @constant
 */
GROUP_LETTER_LOWER = expand('0061-007A00B500DF-00F600F8-00FF010101030105' +
    '01070109010B010D010F01110113011501170119011B011D011F0121012301250127' +
    '0129012B012D012F01310133013501370138013A013C013E01400142014401460148' +
    '0149014B014D014F01510153015501570159015B015D015F01610163016501670169' +
    '016B016D016F0171017301750177017A017C017E-0180018301850188018C018D0192' +
    '01950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-' +
    '01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E5' +
    '01E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209' +
    '020B020D020F02110213021502170219021B021D021F02210223022502270229022B' +
    '022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-' +
    '02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD' +
    '03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F0461' +
    '0463046504670469046B046D046F04710473047504770479047B047D047F0481048B' +
    '048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD' +
    '04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF' +
    '04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F1' +
    '04F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513' +
    '051505170519051B051D051F05210523052505270561-05871D00-1D2B1D6B-1D77' +
    '1D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D' +
    '1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F' +
    '1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E61' +
    '1E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E83' +
    '1E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB' +
    '1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD' +
    '1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF' +
    '1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-' +
    '1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB4' +
    '1FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF6' +
    '1FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C61' +
    '2C652C662C682C6A2C6C2C712C732C742C76-2C7B2C812C832C852C872C892C8B2C8D' +
    '2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF' +
    '2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD1' +
    '2CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2CF32D00-2D252D272D2D' +
    'A641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA661' +
    'A663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695' +
    'A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741' +
    'A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763' +
    'A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CA78E' +
    'A791A793A7A1A7A3A7A5A7A7A7A9A7FAFB00-FB06FB13-FB17FF41-FF5A'
);

/**
 * Expose Unicode Alphabetic Range: Contains Lu (Letter, uppercase),
 * Ll (Letter, lowercase), and Lo (Letter, other).
 *
 * "Borrowed" from XRegexp.
 *
 * @global
 * @private
 * @constant
 */
GROUP_ALPHABETIC = expand('0041-005A0061-007A00AA00B500BA00C0-00D6' +
    '00D8-00F600F8-02C102C6-02D102E0-02E402EC02EE03450370-037403760377' +
    '037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-0527' +
    '0531-055605590561-058705B0-05BD05BF05C105C205C405C505C705D0-05EA' +
    '05F0-05F20610-061A0620-06570659-065F066E-06D306D5-06DC06E1-06E8' +
    '06ED-06EF06FA-06FC06FF0710-073F074D-07B107CA-07EA07F407F507FA0800-' +
    '0817081A-082C0840-085808A008A2-08AC08E4-08E908F0-08FE0900-093B' +
    '093D-094C094E-09500955-09630971-09770979-097F0981-09830985-098C' +
    '098F09900993-09A809AA-09B009B209B6-09B909BD-09C409C709C809CB09CC' +
    '09CE09D709DC09DD09DF-09E309F009F10A01-0A030A05-0A0A0A0F0A100A13-' +
    '0A280A2A-0A300A320A330A350A360A380A390A3E-0A420A470A480A4B0A4C0A51' +
    '0A59-0A5C0A5E0A70-0A750A81-0A830A85-0A8D0A8F-0A910A93-0AA80AAA-' +
    '0AB00AB20AB30AB5-0AB90ABD-0AC50AC7-0AC90ACB0ACC0AD00AE0-0AE30B01-' +
    '0B030B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D-0B44' +
    '0B470B480B4B0B4C0B560B570B5C0B5D0B5F-0B630B710B820B830B85-0B8A0B8E' +
    '-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BBE-' +
    '0BC20BC6-0BC80BCA-0BCC0BD00BD70C01-0C030C05-0C0C0C0E-0C100C12-0C28' +
    '0C2A-0C330C35-0C390C3D-0C440C46-0C480C4A-0C4C0C550C560C580C590C60-' +
    '0C630C820C830C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD-0CC4' +
    '0CC6-0CC80CCA-0CCC0CD50CD60CDE0CE0-0CE30CF10CF20D020D030D05-0D0C' +
    '0D0E-0D100D12-0D3A0D3D-0D440D46-0D480D4A-0D4C0D4E0D570D60-0D63' +
    '0D7A-0D7F0D820D830D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60DCF-0DD4' +
    '0DD60DD8-0DDF0DF20DF30E01-0E3A0E40-0E460E4D0E810E820E840E870E88' +
    '0E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB90EBB-' +
    '0EBD0EC0-0EC40EC60ECD0EDC-0EDF0F000F40-0F470F49-0F6C0F71-0F810F88-' +
    '0F970F99-0FBC1000-10361038103B-103F1050-10621065-1068106E-1086108E' +
    '109C109D10A0-10C510C710CD10D0-10FA10FC-1248124A-124D1250-12561258' +
    '125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-' +
    '12C512C8-12D612D8-13101312-13151318-135A135F1380-138F13A0-13F4' +
    '1401-166C166F-167F1681-169A16A0-16EA16EE-16F01700-170C170E-1713' +
    '1720-17331740-17531760-176C176E-1770177217731780-17B317B6-17C817D' +
    '717DC1820-18771880-18AA18B0-18F51900-191C1920-192B1930-19381950-' +
    '196D1970-19741980-19AB19B0-19C91A00-1A1B1A20-1A5E1A61-1A741AA71B00' +
    '-1B331B35-1B431B45-1B4B1B80-1BA91BAC-1BAF1BBA-1BE51BE7-1BF11C00-' +
    '1C351C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF31CF51CF61D00-1DBF1E00-1F15' +
    '1F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB4' +
    '1FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-' +
    '1FF41FF6-1FFC2071207F2090-209C21022107210A-211321152119-211D2124' +
    '21262128212A-212D212F-2139213C-213F2145-2149214E2160-218824B6-' +
    '24E92C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2CF22CF32D00-2D252D272D2D' +
    '2D30-2D672D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-' +
    '2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2DE0-2DFF2E2F3005-30073021-30293031' +
    '-30353038-303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-' +
    '318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A48CA4D0-A4FDA500-' +
    'A60CA610-A61FA62AA62BA640-A66EA674-A67BA67F-A697A69F-A6EFA717-A71F' +
    'A722-A788A78B-A78EA790-A793A7A0-A7AAA7F8-A801A803-A805A807-A80A' +
    'A80C-A827A840-A873A880-A8C3A8F2-A8F7A8FBA90A-A92AA930-A952A960-' +
    'A97CA980-A9B2A9B4-A9BFA9CFAA00-AA36AA40-AA4DAA60-AA76AA7AAA80-' +
    'AABEAAC0AAC2AADB-AADDAAE0-AAEFAAF2-AAF5AB01-AB06AB09-AB0EAB11-' +
    'AB16AB20-AB26AB28-AB2EABC0-ABEAAC00-D7A3D7B0-D7C6D7CB-D7FBF900-' +
    'FA6DFA70-FAD9FB00-FB06FB13-FB17FB1D-FB28FB2A-FB36FB38-FB3CFB3EFB40' +
    'FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74' +
    'FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7' +
    'FFDA-FFDC'
);

/**
 * Expose Unicode White Space Range.
 *
 * "Borrowed" from XRegexp.
 *
 * @global
 * @private
 * @constant
 */
GROUP_WHITE_SPACE = expand(
    '0009-000D0020008500A01680180E2000-200A20282029202F205F3000'
);

/**
 * Expose Unicode Combining Diacritical Marks, and Combining Diacritical
 * Marks for Symbols, Blocks.
 *
 * @global
 * @private
 * @constant
 */
GROUP_COMBINING_DIACRITICAL_MARK = expand('20D0-20FF0300-036F');

/**
 * Expose Unicode Mark, Nonspacing Block.
 *
 * @global
 * @private
 * @constant
 */
GROUP_COMBINING_NONSPACING_MARK = expand('0300-036F0483-04870591-05BD' +
    '05BF05C105C205C405C505C70610-061A064B-065F067006D6-06DC06DF-06E4' +
    '06E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-0823' +
    '0825-08270829-082D0859-085B08E4-08FE0900-0902093A093C0941-0948094D' +
    '0951-095709620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A42' +
    '0A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD' +
    '0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C40' +
    '0C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41' +
    '-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-' +
    '0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F86' +
    '0F870F8D-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E1058' +
    '1059105E-10601071-1074108210851086108D109D135D-135F1712-17141732-' +
    '1734175217531772177317B417B517B7-17BD17C617C9-17D317DD180B-180D' +
    '18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A62' +
    '1A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B80' +
    '1B811BA2-1BA51BA81BA91BAB1BE61BE81BE91BED1BEF-1BF11C2C-1C331C36' +
    '1C371CD0-1CD21CD4-1CE01CE2-1CE81CED1CF41DC0-1DE61DFC-1DFF20D0-20DC' +
    '20E120E5-20F02CEF-2CF12D7F2DE0-2DFF302A-302D3099309AA66FA674-A67D' +
    'A69FA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951' +
    'A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0' +
    'AAB2-AAB4AAB7AAB8AABEAABFAAC1AAECAAEDAAF6ABE5ABE8ABEDFB1EFE00-FE0F' +
    'FE20-FE26'
);

/**
 * Expose word characters. Includes Unicode:
 *
 * - Number Range (Nd, Nl, and No);
 * - Alphabetic Range (Lu, Ll, and Lo);
 * - Combining Diacritical Marks block;
 * - Combining Diacritical Marks for Symbols block;
 *
 * @global
 * @private
 * @constant
 */
GROUP_WORD = GROUP_NUMERICAL + GROUP_ALPHABETIC +
    GROUP_COMBINING_DIACRITICAL_MARK + GROUP_COMBINING_NONSPACING_MARK;

/**
 * Expose Unicode Cs (Other, Surrogate) category.
 *
 * @global
 * @private
 * @constant
 */
GROUP_ASTRAL = expand('D800-DBFFDC00-DFFF');

/**
 * Expose interrobang, question-, and exclamation mark.
 *
 * - Full stop;
 * - Interrobang;
 * - Question mark;
 * - Exclamation mark;
 * - Horizontal ellipsis.
 *
 * @global
 * @private
 * @constant
 */
GROUP_TERMINAL_MARKER = '\\.\\u203D?!\\u2026';

/**
 * Expose Unicode Pe (Punctuation, Close) category.
 *
 * "Borrowed" from XRegexp.
 *
 * @global
 * @private
 * @constant
 */
GROUP_CLOSING_PUNCTUATION = expand('0029005D007D0F3B0F3D169C2046' +
    '207E208E232A2769276B276D276F27712773277527C627E727E927EB27ED27EF' +
    '298429862988298A298C298E2990299229942996299829D929DB29FD2E232E25' +
    '2E272E293009300B300D300F3011301530173019301B301E301FFD3FFE18FE36' +
    'FE38FE3AFE3CFE3EFE40FE42FE44FE48FE5AFE5CFE5EFF09FF3DFF5DFF60FF63'
);

/**
 * Expose Unicode Pf (Punctuation, Final) category.
 *
 * "Borrowed" from XRegexp.
 *
 * @global
 * @private
 * @constant
 */
GROUP_FINAL_PUNCTUATION = expand('00BB2019201D203A2E032E052E0A2E0D2E1D2E21');

/**
 * A blacklist of full stop characters that should not be treated as
 * terminal sentence markers:
 *
 * - A "word" boundry,
 * - followed by a case-insensitive abbreviation,
 * - followed by full stop.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_ABBREVIATION_PREFIX = new RegExp(
    '^(' +
        '[0-9]+|' +
        '[a-z]|' +
        /*
         * Common Latin Abbreviations:
         * Based on: http://en.wikipedia.org/wiki/List_of_Latin_abbreviations
         * Where only the abbreviations written without joining full stops,
         * but with a final full stop, were extracted.
         *
         * circa, capitulus, confer, compare, centum weight, eadem, (et) alii,
         * et cetera, floruit, foliis, ibidem, idem, nemine && contradicente,
         * opere && citato, (per) cent, (per) procurationem, (pro) tempore,
         * sic erat scriptum, (et) sequentia, statim, videlicet.
         */
        'ca|cap|cca|cf|cp|cwt|ead|al|etc|fl|ff|ibid|id|nem|con|op|cit|cent|' +
        'pro|tem|sic|seq|stat|viz' +
    ')$'
);

/**
 * Matches closing or final punctuation, or terminal markers that should
 * still be included in the previous sentence, even though they follow
 * the sentence's terminal marker.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_AFFIX_PUNCTUATION = new RegExp(
    '^([' +
        GROUP_CLOSING_PUNCTUATION +
        GROUP_FINAL_PUNCTUATION +
        GROUP_TERMINAL_MARKER +
        '"\'' +
    '])\\1*$'
);

/**
 * Matches a string consisting of one or more new line characters.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_NEW_LINE = /^(\r?\n|\r)+$/;

/**
 * Matches a string consisting of two or more new line characters.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_MULTI_NEW_LINE = /^(\r?\n|\r){2,}$/;

/**
 * Matches a sentence terminal marker, one or more of the following:
 *
 * - Full stop;
 * - Interrobang;
 * - Question mark;
 * - Exclamation mark;
 * - Horizontal ellipsis.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_TERMINAL_MARKER = new RegExp(
    '^([' + GROUP_TERMINAL_MARKER + ']+)$'
);

/**
 * Matches punctuation part of the surrounding words.
 *
 * Includes:
 * - Hyphen-minus;
 * - At sign;
 * - Question mark;
 * - Equals sign;
 * - full-stop;
 * - colon;
 * - Dumb single quote;
 * - Right single quote;
 * - Ampersand;
 * - Soft hyphen;
 * - Hyphen;
 * - Non-breaking hyphen;
 * - Hyphenation point;
 * - Middle dot;
 * - Slash (one or more);
 * - Underscore (one or more).
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_INNER_WORD_PUNCTUATION =
    /^([-@?=.:'\u2019&\u00AD\u00B7\u2010\2011\u2027]|[_\/]+)$/;

/**
 * Matches punctuation part of the next word.
 *
 * Includes:
 * - Ampersand;
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_INITIAL_WORD_PUNCTUATION = /^&$/;

/**
 * Matches punctuation part of the previous word.
 *
 * Includes:
 * - Hyphen-minus.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_FINAL_WORD_PUNCTUATION = /^-$/;

/**
 * Matches a number.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_NUMERICAL = new RegExp('^[' + GROUP_NUMERICAL + ']+$');

/**
 * Matches an initial lower case letter.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_LOWER_INITIAL_EXCEPTION = new RegExp(
    '^[' +
        GROUP_LETTER_LOWER +
    ']'
);

/**
 * Apply modifiers on a token.
 *
 * @param {Array.<Function>} modifiers
 * @param {Object} parent
 * @global
 * @private
 */
function modify(modifiers, parent) {
    var length = modifiers.length,
        iterator = -1,
        modifier, pointer, result, children;

    /* Iterate over all modifiers... */
    while (++iterator < length) {
        modifier = modifiers[iterator];
        pointer = -1;

        /*
         * We allow conditional assignment here, because the length of the
         * parent's children will probably change.
         */
        children = parent.children;

        /* Iterate over all children... */
        while (children[++pointer]) {
            result = modifier(children[pointer], pointer, parent);

            /*
             * If the modifier returns a number, move the pointer over to
             * that child.
             */
            if (typeof result === 'number') {
                pointer = result - 1;
            }
        }
    }
}

/**
 * Returns the value of all `TextNode` tokens inside a given token.
 *
 * @param {Object} token
 * @return {string} - The stringified token.
 * @global
 * @private
 */
function tokenToString(token) {
    var value = '',
        iterator, children;

    if (token.value) {
        return token.value;
    }

    iterator = -1;
    children = token.children;

    /* Shortcut: This is pretty common, and a small performance win. */
    if (children.length === 1 && children[0].type === 'TextNode') {
        return children[0].value;
    }

    while (children[++iterator]) {
        value += tokenToString(children[iterator]);
    }

    return value;
}

/**
 * Creates a (modifiable) tokenizer.
 *
 * @param {Object} context               - The class to attach to.
 * @param {Object} options               - The settings to use.
 * @param {string} options.name          - The name of the method.
 * @param {string} options.type          - The type of parent node to create.
 * @param {string} options.tokenizer     - The property where the child
 *                                         tokenizer lives
 * @param {Array.<Function>} options.modifiers - The initial modifiers to
 *                                         apply on each parse.
 * @param {RegExp} options.delimiter     - The delimiter to break children at.
 * @return {Function} - The tokenizer.
 * @global
 * @private
 */
function tokenizerFactory(context, options) {
    var name = options.name;

    context.prototype[name + 'Modifiers'] = options.modifiers;
    context.prototype[name + 'Delimiter'] = options.delimiter;

    return function (value) {
        var delimiter = this[name + 'Delimiter'],
            lastIndex, children, iterator, length, root, start, stem, tokens;

        root = {
            'type' : options.type,
            'children' : []
        };

        children = root.children;

        stem = this[options.tokenizer](value);
        tokens = stem.children;

        length = tokens.length;
        lastIndex = length - 1;
        iterator = -1;
        start = 0;

        while (++iterator < length) {
            if (
                iterator !== lastIndex &&
                !delimiter.test(tokenToString(tokens[iterator]))
            ) {
                continue;
            }

            children.push({
                'type' : stem.type,
                'children' : tokens.slice(start, iterator + 1)
            });

            start = iterator + 1;
        }

        modify(this[name + 'Modifiers'], root);

        return root;
    };
}

/**
 * Merges certain punctuation marks into their previous words.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergeInitialWordPunctuation(child, index, parent) {
    var children, next, hasPreviousWord, hasNextWord;

    if (
        child.type !== 'PunctuationNode' ||
        !EXPRESSION_INITIAL_WORD_PUNCTUATION.test(tokenToString(child))
    ) {
        return;
    }

    children = parent.children;
    next = children[index + 1];

    hasPreviousWord = index !== 0 && children[index - 1].type === 'WordNode';
    hasNextWord = next && next.type === 'WordNode';

    if (hasPreviousWord || !hasNextWord) {
        return;
    }

    /* Remove `child` from parent. */
    children.splice(index, 1);

    /* Add the punctuation mark at the start of the next node. */
    next.children.unshift(child);

    /* Next, iterate over the node at the previous position. */
    return index - 1;
}

/**
 * Merges certain punctuation marks into their preceding words.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergeFinalWordPunctuation(child, index, parent) {
    var children, prev, next;

    if (
        index === 0 ||
        child.type !== 'PunctuationNode' ||
        !EXPRESSION_FINAL_WORD_PUNCTUATION.test(tokenToString(child))
    ) {
        return;
    }

    children = parent.children;
    prev = children[index - 1];
    next = children[index + 1];

    if (
        (next && next.type === 'WordNode') ||
        !(prev && prev.type === 'WordNode')
    ) {
        return;
    }

    /* Remove `child` from parent. */
    children.splice(index, 1);

    /* Add the punctuation mark at the end of the previous node. */
    prev.children.push(child);

    /* Next, iterate over the node *now* at the current position (which was
     * the next node). */
    return index;
}

/**
 * Merges two words surrounding certain punctuation marks.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergeInnerWordPunctuation(child, index, parent) {
    var children, prev, otherChild,
        iterator, tokens, queue;

    if (index === 0 || child.type !== 'PunctuationNode') {
        return;
    }

    children = parent.children;
    prev = children[index - 1];

    if (!prev || prev.type !== 'WordNode') {
        return;
    }

    iterator = index - 1;
    tokens = [];
    queue = [];

    /*
     * - Is a token which is neither word nor inner word punctuation is
     *   found, the loop is broken.
     * - If a inner word punctuation mark is found, it's queued.
     * - If a word is found, it's queued (and the queue stored and emptied).
     */
    while (children[++iterator]) {
        otherChild = children[iterator];

        if (otherChild.type === 'WordNode') {
            tokens = tokens.concat(queue, otherChild.children);
            queue = [];
            continue;
        }

        if (
            otherChild.type === 'PunctuationNode' &&
            EXPRESSION_INNER_WORD_PUNCTUATION.test(tokenToString(otherChild))
        ) {
            queue.push(otherChild);
            continue;
        }

        break;
    }

    /* If no tokens were found, exit. */
    if (!tokens.length) {
        return;
    }

    /* If there was a queue found, remove its length from iterator. */
    if (queue.length) {
        iterator -= queue.length;
    }

    /* Remove every (one or more) inner-word punctuation marks, and children
     * of words. */
    children.splice(index, iterator - index);

    /* Add all found tokens to prev.children */
    prev.children = prev.children.concat(tokens);

    return index;
}

/**
 * Merges initialisms.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergeInitialisms(child, index, parent) {
    var prev, children, length, iterator, otherChild, isAllDigits, value;

    if (
        index === 0 || child.type !== 'PunctuationNode' ||
        tokenToString(child) !== '.'
    ) {
        return;
    }

    prev = parent.children[index - 1];
    children = prev.children;

    /* istanbul ignore else: TOSPEC: Currently not spec-able, but
     * future-friendly */
    if (children) {
        length = children.length;
    } else {
        length = 0;
    }

    if (prev.type !== 'WordNode' || length < 2 || length % 2 === 0) {
        return;
    }

    iterator = length;
    isAllDigits = true;

    while (children[--iterator]) {
        otherChild = children[iterator];
        value = tokenToString(otherChild);

        if (iterator % 2 === 0) {
            /* istanbul ignore if: TOSPEC: Currently not spec-able, but
             * future-friendly */
            if (otherChild.type !== 'TextNode') {
                return;
            }

            if (value.length > 1) {
                return;
            }

            if (!EXPRESSION_NUMERICAL.test(value)) {
                isAllDigits = false;
            }
        } else if (otherChild.type !== 'PunctuationNode' || value !== '.') {
            /* istanbul ignore else: TOSPEC */
            if (iterator < length - 2) {
                break;
            } else {
                return;
            }
        }
    }

    if (isAllDigits) {
        return;
    }

    /* Remove `child` from parent. */
    parent.children.splice(index, 1);

    /* Add child to the previous children. */
    children.push(child);
}

/**
 * Merges a sentence into its next sentence, when the sentence ends with
 * a certain word.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergePrefixExceptions(child, index, parent) {
    var children = child.children,
        node;

    if (
        !children ||
        !children.length ||
        index === parent.children.length - 1
    ) {
        return;
    }

    node = children[children.length - 1];

    if (
        !node || node.type !== 'PunctuationNode' ||
        tokenToString(node) !== '.'
    ) {
        return;
    }

    node = children[children.length - 2];

    if (!node ||
        node.type !== 'WordNode' ||
        !EXPRESSION_ABBREVIATION_PREFIX.test(
            tokenToString(node).toLowerCase()
        )
    ) {
        return;
    }

    child.children = children.concat(
        parent.children[index + 1].children
    );

    parent.children.splice(index + 1, 1);

    return index - 1;
}

/**
 * Merges a sentence into its previous sentence, when the sentence starts
 * with a comma.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergeAffixExceptions(child, index, parent) {
    var children = child.children,
        node, iterator, previousChild;

    if (!children || !children.length || index === 0) {
        return;
    }

    iterator = -1;

    while (children[++iterator]) {
        node = children[iterator];

        if (node.type === 'WordNode') {
            return;
        }

        if (node.type === 'PunctuationNode') {
            break;
        }
    }

    if (
        !node ||
        node.type !== 'PunctuationNode' ||
        !(tokenToString(node) === ',' || tokenToString(node) === ';')
    ) {
        return;
    }

    previousChild = parent.children[index - 1];

    previousChild.children = previousChild.children.concat(
        children
    );

    parent.children.splice(index, 1);

    return index - 1;
}

/**
 * Moves white space starting a sentence up, so they are the siblings
 * of sentences.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function makeInitialWhiteSpaceAndSourceSiblings(child, index, parent) {
    var children = child.children;

    if (
        !children ||
        !children.length ||
        (
            children[0].type !== 'WhiteSpaceNode' &&
            children[0].type !== 'SourceNode'
        )
    ) {
        return;
    }

    parent.children.splice(index, 0, children.shift());
}

/**
 * Moves white space ending a paragraph up, so they are the siblings
 * of paragraphs.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function makeFinalWhiteSpaceAndSourceSiblings(child, index, parent) {
    var children = child.children;

    if (
        !children ||
        children.length < 1 ||
        (
            children[children.length - 1].type !== 'WhiteSpaceNode' &&
            children[children.length - 1].type !== 'SourceNode'
        )
    ) {
        return;
    }

    parent.children.splice(index + 1, 0, child.children.pop());
}

/**
 * Merges non-terminal marker full stops into, if available, the previous
 * word, or if available, the next word.
 *
 * @param {Object} child
 * @param {number} index
 * @return {undefined}
 *
 * @global
 * @private
 */
function mergeRemainingFullStops(child, index) {
    var children = child.children,
        iterator = children.length,
        grandchild, prev, next, hasFoundDelimiter;

    hasFoundDelimiter = false;

    while (children[--iterator]) {
        grandchild = children[iterator];

        if (grandchild.type !== 'PunctuationNode') {
            /* This is a sentence without terminal marker, so we 'fool' the
             * code to make it think we have found one. */
            if (grandchild.type === 'WordNode') {
                hasFoundDelimiter = true;
            }
            continue;
        }

        /* Exit when this token is not a terminal marker. */
        if (!EXPRESSION_TERMINAL_MARKER.test(tokenToString(grandchild))) {
            continue;
        }

        /* Exit when this is the first terminal marker found (starting at the
         * end), so it should not be merged. */
        if (!hasFoundDelimiter) {
            hasFoundDelimiter = true;
            continue;
        }

        /* Only merge a single full stop. */
        if (tokenToString(grandchild) !== '.') {
            continue;
        }

        prev = children[iterator - 1];
        next = children[iterator + 1];

        if (prev && prev.type === 'WordNode') {
            /* Exit when the full stop is followed by a space and another,
             * full stop, such as: `{.} .` */
            if (
                next && next.type === 'WhiteSpaceNode' &&
                children[iterator + 2] &&
                children[iterator + 2].type === 'PunctuationNode' &&
                tokenToString(children[iterator + 2]) === '.'
            ) {
                continue;
            }

            /* Remove `child` from parent. */
            children.splice(iterator, 1);

            /* Add the punctuation mark at the end of the previous node. */
            prev.children.push(grandchild);

            iterator--;
        } else if (next && next.type === 'WordNode') {
            /* Remove `child` from parent. */
            children.splice(iterator, 1);

            /* Add the punctuation mark at the start of the next node. */
            next.children.unshift(grandchild);
        }
    }
}

/**
 * Breaks a sentence if a node containing two or more white spaces is found.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function breakImplicitSentences(child, index, parent) {
    if (child.type !== 'SentenceNode') {
        return;
    }

    var children = child.children,
        iterator = -1,
        length = children.length,
        node;

    while (++iterator < length) {
        node = children[iterator];

        if (node.type !== 'WhiteSpaceNode') {
            continue;
        }

        if (!EXPRESSION_MULTI_NEW_LINE.test(tokenToString(node))) {
            continue;
        }

        child.children = children.slice(0, iterator);

        parent.children.splice(index + 1, 0, node, {
            'type' : 'SentenceNode',
            'children' : children.slice(iterator + 1)
        });

        return index + 2;
    }
}

/**
 * Merges a sentence into its previous sentence, when the sentence starts
 * with a lower case letter.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergeInitialLowerCaseLetterSentences(child, index, parent) {
    var node, children, iterator, previousChild;

    children = child.children;

    if (!children || !children.length || index === 0) {
        return;
    }

    iterator = -1;

    while (children[++iterator]) {
        node = children[iterator];

        if (node.type === 'PunctuationNode') {
            return;
        } else if (node.type === 'WordNode') {
            if (
                !EXPRESSION_LOWER_INITIAL_EXCEPTION.test(tokenToString(node))
            ) {
                return;
            }

            previousChild = parent.children[index - 1];

            previousChild.children = previousChild.children.concat(
                children
            );

            parent.children.splice(index, 1);

            return index - 1;
        }
    }
}

/**
 * Merges a sentence into the following sentence, when the sentence does
 * not contain word tokens.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergeNonWordSentences(child, index, parent) {
    var children, iterator, otherChild;

    children = child.children;
    iterator = -1;

    while (children[++iterator]) {
        if (children[iterator].type === 'WordNode') {
            return;
        }
    }

    otherChild = parent.children[index - 1];

    if (otherChild) {
        otherChild.children = otherChild.children.concat(children);

        /* Remove the child. */
        parent.children.splice(index, 1);

        return index - 1;
    }

    otherChild = parent.children[index + 1];

    if (otherChild) {
        otherChild.children = children.concat(otherChild.children);

        /* Remove the child. */
        parent.children.splice(index, 1);

        return 0;
    }
}

/**
 * Merges punctuation- and whitespace-only between two line breaks into a
 * source node.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergeSourceLines(child, index, parent) {
    var iterator, siblings, sibling, value;

    if (
        !child ||
        child.type !== 'WhiteSpaceNode' ||
        !EXPRESSION_NEW_LINE.test(tokenToString(child))
    ) {
        return;
    }

    siblings = parent.children;
    iterator = index;
    value = '';

    while (siblings[--iterator]) {
        sibling = siblings[iterator];

        if (sibling.type === 'WordNode') {
            return;
        }

        if (
            sibling.type === 'WhiteSpaceNode' &&
            EXPRESSION_NEW_LINE.test(tokenToString(sibling))
        ) {
            break;
        }

        value = tokenToString(sibling) + value;
    }

    if (!value) {
        return;
    }

    siblings.splice(iterator + 1, index - iterator - 1, {
        'type' : 'SourceNode',
        'value' : value
    });

    return iterator + 3;
}

/**
 * Moves certain punctuation following a terminal marker (thus in the
 * next sentence) to the previous sentence.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergeAffixPunctuation(child, index, parent) {
    var children = child.children;

    if (!children || !children.length || index === 0) {
        return;
    }

    if (
        children[0].type !== 'PunctuationNode' ||
        !EXPRESSION_AFFIX_PUNCTUATION.test(tokenToString(children[0]))
    ) {
        return;
    }

    parent.children[index - 1].children.push(children.shift());

    return index - 1;
}

/**
 * Removes empty children.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function removeEmptyNodes(child, index, parent) {
    if ('children' in child && !child.children.length) {
        parent.children.splice(index, 1);
        return index > 0 ? index - 1 : 0;
    }
}

/**
 * Returns a function which in turn returns nodes of the given type.
 *
 * @param {string} type
 * @return {Function} - A function which creates nodes of the given type.
 * @global
 * @private
 */
function createNodeFactory(type) {
    return function (value) {
        return {
            'type' : type,
            'children' : [
                this.tokenizeText(value)
            ]
        };
    };
}

/**
 * Returns a function which in turn returns text nodes of the given type.
 *
 * @param {string} type
 * @return {Function} - A function which creates text nodes of the given type.
 * @global
 * @private
 */
function createTextNodeFactory(type) {
    return function (value) {
        if (value === null || value === undefined) {
            value = '';
        }

        return {
            'type' : type,
            'value' : String(value)
        };
    };
}

/**
 * `ParseLatin` contains the functions needed to tokenize natural Latin-script
 * language into a syntax tree.
 *
 * @constructor
 * @public
 */
function ParseLatin() {
    /*
     * TODO: This should later be removed (when this change bubbles
     * through to dependants)
     */
    if (!(this instanceof ParseLatin)) {
        return new ParseLatin();
    }
}

parseLatinPrototype = ParseLatin.prototype;

/**
 * Matches all tokens:
 * - One or more number, alphabetic, or combining characters;
 * - One or more white space characters;
 * - One or more astral plane characters;
 * - One or more of the same character;
 *
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.EXPRESSION_TOKEN = new RegExp(
    '[' + GROUP_WORD + ']+|' +
    '[' + GROUP_WHITE_SPACE + ']+|' +
    '[' + GROUP_ASTRAL + ']+|' +
    '([\\s\\S])\\1*',
    'g'
);

/**
 * Matches a word.
 *
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.EXPRESSION_WORD = new RegExp(
    '^[' + GROUP_WORD + ']+$'
);

/**
 * Matches a string containing ONLY white space.
 *
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.EXPRESSION_WHITE_SPACE = new RegExp(
    '^[' + GROUP_WHITE_SPACE + ']+$'
);

/**
 * Tokenize natural Latin-script language into letter and numbers (words),
 * white space, and everything else (punctuation).
 *
 * @param {string?} value
 * @return {Array.<Object>} - An array of tokens.
 *
 * @public
 * @memberof ParseLatin#
 */
parseLatinPrototype.tokenize = function (value) {
    var self, tokens, delimiter, start, end, match;

    if (value === null || value === undefined) {
        value = '';
    } else if (value instanceof String) {
        value = value.toString();
    }

    if (typeof value !== 'string') {
        throw new TypeError('Illegal invocation: \'' + value +
            '\' is not a valid argument for \'ParseLatin\'');
    }

    self = this;

    tokens = [];

    if (!value) {
        return tokens;
    }

    delimiter = self.EXPRESSION_TOKEN;

    delimiter.lastIndex = 0;
    start = 0;
    match = delimiter.exec(value);

    /* for every match of the token delimiter expression... */
    while (match) {
        /*
         * Move the pointer over to after its last character.
         */
        end = match.index + match[0].length;

        /*
         * Slice the found content, from (including) start to (not including)
         * end, classify it, and add the result to tokens.
         */
        tokens.push(self.classifier(value.substring(start, end)));

        match = delimiter.exec(value);
        start = end;
    }

    return tokens;
};

/*eslint-enable no-cond-assign */

/**
 * Classify a token.
 *
 * @param {string?} value
 * @return {Object} - A classified token.
 *
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.classifier = function (value) {
    var type;

    /*
     * If the token consists solely of white space, classify it as white
     * space.
     */
    if (this.EXPRESSION_WHITE_SPACE.test(value)) {
        type = 'WhiteSpace';
    /*
     * Otherwise, if the token contains just word characters, classify it as
     * a word.
     */
    } else if (this.EXPRESSION_WORD.test(value)) {
        type = 'Word';
    /*
     * Otherwise, classify it as punctuation.
     */
    } else {
        type = 'Punctuation';
    }

    /* Return a token. */
    return this['tokenize' + type](value);
};

/**
 * Returns a source node, with its value set to the given value.
 *
 * @param {string} value
 * @return {Object} - The SourceNode.
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.tokenizeSource = createTextNodeFactory('SourceNode');

/**
 * Returns a text node, with its value set to the given value.
 *
 * @param {string} value
 * @return {Object} - The TextNode.
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.tokenizeText = createTextNodeFactory('TextNode');

/**
 * Returns a word node, with its children set to a single text node, its
 * value set to the given value.
 *
 * @param {string} value
 * @return {Object} - The WordNode.
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.tokenizeWord = createNodeFactory('WordNode');

/**
 * Returns a white space node, with its children set to a single text node,
 * its value set to the given value.
 *
 * @param {string} value
 * @return {Object} - The whiteSpaceNode.
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.tokenizeWhiteSpace = createNodeFactory('WhiteSpaceNode');

/**
 * Returns a punctuation node, with its children set to a single text node,
 * its value set to the given value.
 *
 * @param {string} value
 * @return {Object} - The PunctuationNode.
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.tokenizePunctuation =
    createNodeFactory('PunctuationNode');

/**
 * Tokenize natural Latin-script language into a sentence token.
 *
 * @param {string?} value
 * @return {Object} - A sentence token.
 *
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.tokenizeSentence = function (value) {
    var root = {
        'type' : 'SentenceNode',
        'children' : this.tokenize(value)
    };

    modify(this.tokenizeSentenceModifiers, root);

    /*
     * Return a sentence token, with its children set to the result of
     * tokenizing the given value.
     */
    return root;
};

parseLatinPrototype.tokenizeSentenceModifiers = [
    mergeInitialWordPunctuation,
    mergeFinalWordPunctuation,
    mergeInnerWordPunctuation,
    mergeSourceLines,
    mergeInitialisms
];

/**
 * Tokenize natural Latin-script language into a paragraph token.
 *
 * @param {string?} value
 * @return {Object} - A paragraph token.
 *
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.tokenizeParagraph = tokenizerFactory(ParseLatin, {
    'name' : 'tokenizeParagraph',
    'tokenizer' : 'tokenizeSentence',
    'type' : 'ParagraphNode',
    'delimiter' : EXPRESSION_TERMINAL_MARKER,
    'modifiers' : [
        mergeNonWordSentences,
        mergeAffixPunctuation,
        mergeInitialLowerCaseLetterSentences,
        mergePrefixExceptions,
        mergeAffixExceptions,
        mergeRemainingFullStops,
        makeInitialWhiteSpaceAndSourceSiblings,
        makeFinalWhiteSpaceAndSourceSiblings,
        breakImplicitSentences,
        removeEmptyNodes
    ]
});

/**
 * Tokenize natural Latin-script language into a root token.
 *
 * @param {string?} value
 * @return {Object} - A root token.
 *
 * @private
 * @memberof ParseLatin#
 */
parseLatinPrototype.tokenizeRoot = tokenizerFactory(ParseLatin, {
    'name' : 'tokenizeRoot',
    'tokenizer' : 'tokenizeParagraph',
    'type' : 'RootNode',
    'delimiter' : EXPRESSION_NEW_LINE,
    'modifiers' : [makeFinalWhiteSpaceAndSourceSiblings, removeEmptyNodes]
});

/**
 * Tokenize natural Latin-script language into a syntax tree.
 *
 * @param {string?} value
 * @return {Object} - The tokenized document.
 *
 * @public
 * @memberof ParseLatin#
 */
parseLatinPrototype.parse = function (value) {
    return this.tokenizeRoot(value);
};

/**
 * Export ParseLatin.
 */
module.exports = ParseLatin;

});

require.register("wooorm~textom@0.1.1", function (exports, module) {
'use strict';

/**
 * Utilities.
 */
var arrayPrototype = Array.prototype,
    arrayUnshift = arrayPrototype.unshift,
    arrayPush = arrayPrototype.push,
    arraySlice = arrayPrototype.slice,
    arrayIndexOf = arrayPrototype.indexOf,
    arraySplice = arrayPrototype.splice;

/* istanbul ignore if: User forgot a polyfill much? */
if (!arrayIndexOf) {
    throw new Error('Missing Array#indexOf() method for TextOM');
}

var ROOT_NODE = 'RootNode',
    PARAGRAPH_NODE = 'ParagraphNode',
    SENTENCE_NODE = 'SentenceNode',
    WORD_NODE = 'WordNode',
    PUNCTUATION_NODE = 'PunctuationNode',
    WHITE_SPACE_NODE = 'WhiteSpaceNode',
    SOURCE_NODE = 'SourceNode',
    TEXT_NODE = 'TextNode';

function fire(context, callbacks, args) {
    var iterator = -1;

    if (!callbacks || !callbacks.length) {
        return;
    }

    callbacks = callbacks.concat();

    while (callbacks[++iterator]) {
        callbacks[iterator].apply(context, args);
    }

    return;
}

function canInsertIntoParent(parent, child) {
    var allowed = parent.allowedChildTypes;

    if (!allowed || !allowed.length || !child.type) {
        return true;
    }

    return allowed.indexOf(child.type) > -1;
}

function validateInsert(parent, item, child) {
    if (!parent) {
        throw new TypeError('Illegal invocation: \'' + parent +
            ' is not a valid argument for \'insert\'');
    }

    if (!child) {
        throw new TypeError('\'' + child +
            ' is not a valid argument for \'insert\'');
    }

    if (parent === child || parent === item) {
        throw new Error('HierarchyError: Cannot insert a node into itself');
    }

    if (!canInsertIntoParent(parent, child)) {
        throw new Error('HierarchyError: The operation would ' +
            'yield an incorrect node tree');
    }

    if (typeof child.remove !== 'function') {
        throw new Error('The operated on node did not have a ' +
            '`remove` method');
    }

    /* Insert after... */
    if (item) {
        /* istanbul ignore if: Wrong-usage */
        if (item.parent !== parent) {
            throw new Error('The operated on node (the "pointer") ' +
                'was detached from the parent');
        }

        /* istanbul ignore if: Wrong-usage */
        if (arrayIndexOf.call(parent, item) === -1) {
            throw new Error('The operated on node (the "pointer") ' +
                'was attached to its parent, but the parent has no ' +
                'indice corresponding to the item');
        }
    }
}

/**
 * Inserts the given `child` after (when given), the `item`, and otherwise as
 * the first item of the given parents.
 *
 * @param {Object} parent
 * @param {Object} item
 * @param {Object} child
 * @api private
 */
function insert(parent, item, child) {
    var next;

    validateInsert(parent, item, child);

    /* Detach the child. */
    child.remove();

    /* Set the child's parent to items parent. */
    child.parent = parent;

    if (item) {
        next = item.next;

        /* If item has a next node... */
        if (next) {
            /* ...link the child's next node, to items next node. */
            child.next = next;

            /* ...link the next nodes previous node, to the child. */
            next.prev = child;
        }

        /* Set the child's previous node to item. */
        child.prev = item;

        /* Set the next node of item to the child. */
        item.next = child;

        /* If the parent has no last node or if item is the parent last node,
         * link the parents last node to the child. */
        if (item === parent.tail || !parent.tail) {
            parent.tail = child;
            arrayPush.call(parent, child);
        /* Else, insert the child into the parent after the items index. */
        } else {
            arraySplice.call(
                parent, arrayIndexOf.call(parent, item) + 1, 0, child
            );
        }
    /* If parent has a first node... */
    } else if (parent.head) {
        next = parent.head;

        /* Set the child's next node to head. */
        child.next = next;

        /* Set the previous node of head to the child. */
        next.prev = child;

        /* Set the parents heads to the child. */
        parent.head = child;

        /* If the the parent has no last node, link the parents last node to
         * head. */
        if (!parent.tail) {
            parent.tail = next;
        }

        arrayUnshift.call(parent, child);
    /* Prepend. There is no `head` (or `tail`) node yet. */
    } else {
        /* Set parent's first node to the prependee and return the child. */
        parent.head = child;
        parent[0] = child;
        parent.length = 1;
    }

    next = child.next;

    child.emit('insert');

    if (item) {
        item.emit('changenext', child, next);
        child.emit('changeprev', item, null);
    }

    if (next) {
        next.emit('changeprev', child, item);
        child.emit('changenext', next, null);
    }

    parent.trigger('insertinside', child);

    return child;
}

/**
 * Detach a node from its (when applicable) parent, links its (when
 * existing) previous and next items to each other.
 *
 * @param {Object} node
 * @api private
 */
function remove(node) {
    /* istanbul ignore if: Wrong-usage */
    if (!node) {
        return false;
    }

    /* Cache self, the parent list, and the previous and next items. */
    var parent = node.parent,
        prev = node.prev,
        next = node.next,
        indice;

    /* If the item is already detached, return node. */
    if (!parent) {
        return node;
    }

    /* If node is the last item in the parent, link the parents last
     * item to the previous item. */
    if (parent.tail === node) {
        parent.tail = prev;
    }

    /* If node is the first item in the parent, link the parents first
     * item to the next item. */
    if (parent.head === node) {
        parent.head = next;
    }

    /* If both the last and first items in the parent are the same,
     * remove the link to the last item. */
    if (parent.tail === parent.head) {
        parent.tail = null;
    }

    /* If a previous item exists, link its next item to nodes next
     * item. */
    if (prev) {
        prev.next = next;
    }

    /* If a next item exists, link its previous item to nodes previous
     * item. */
    if (next) {
        next.prev = prev;
    }

    /* istanbul ignore else: Wrong-usage */
    if ((indice = arrayIndexOf.call(parent, node)) !== -1) {
        arraySplice.call(parent, indice, 1);
    }

    /* Remove links from node to both the next and previous items,
     * and to the parent. */
    node.prev = node.next = node.parent = null;

    node.emit('remove', parent);

    if (next) {
        next.emit('changeprev', prev || null, node);
        node.emit('changenext', null, next);
    }

    if (prev) {
        node.emit('changeprev', null, prev);
        prev.emit('changenext', next || null, node);
    }

    parent.trigger('removeinside', node, parent);

    /* Return node. */
    return node;
}

function validateSplitPosition(position, length) {
    if (
        position === null ||
        position === undefined ||
        position !== position ||
        position === -Infinity
    ) {
            position = 0;
    } else if (position === Infinity) {
        position = length;
    } else if (typeof position !== 'number') {
        throw new TypeError('\'' + position + ' is not a valid ' +
            'argument for \'#split\'');
    } else if (position < 0) {
        position = Math.abs((length + position) % length);
    }

    return position;
}

function TextOMConstructor() {
    /**
     * Expose `Node`. Initialises a new `Node` object.
     *
     * @api public
     * @constructor
     */
    function Node() {
        if (!this.data) {
            /** @member {Object} */
            this.data = {};
        }
    }

    var prototype = Node.prototype;

    prototype.on = Node.on = function (name, callback) {
        var self = this,
            callbacks;

        if (typeof name !== 'string') {
            if (name === null || name === undefined) {
                return self;
            }

            throw new TypeError('Illegal invocation: \'' + name +
                ' is not a valid argument for \'listen\'');
        }

        if (typeof callback !== 'function') {
            if (callback === null || callback === undefined) {
                return self;
            }

            throw new TypeError('Illegal invocation: \'' + callback +
                ' is not a valid argument for \'listen\'');
        }

        callbacks = self.callbacks || (self.callbacks = {});
        callbacks = callbacks[name] || (callbacks[name] = []);
        callbacks.unshift(callback);

        return self;
    };

    prototype.off = Node.off = function (name, callback) {
        var self = this,
            callbacks, indice;

        if ((name === null || name === undefined) &&
            (callback === null || callback === undefined)) {
            self.callbacks = {};
            return self;
        }

        if (typeof name !== 'string') {
            if (name === null || name === undefined) {
                return self;
            }

            throw new TypeError('Illegal invocation: \'' + name +
                ' is not a valid argument for \'listen\'');
        }

        if (!(callbacks = self.callbacks)) {
            return self;
        }

        if (!(callbacks = callbacks[name])) {
            return self;
        }

        if (typeof callback !== 'function') {
            if (callback === null || callback === undefined) {
                callbacks.length = 0;
                return self;
            }

            throw new TypeError('Illegal invocation: \'' + callback +
                ' is not a valid argument for \'listen\'');
        }

        if ((indice = callbacks.indexOf(callback)) !== -1) {
            callbacks.splice(indice, 1);
        }

        return self;
    };

    prototype.emit = function (name) {
        var self = this,
            args = arraySlice.call(arguments, 1),
            constructors = self.constructor.constructors,
            iterator = -1,
            callbacks = self.callbacks;

        if (callbacks) {
            fire(self, callbacks[name], args);
        }

        /* istanbul ignore if: Wrong-usage */
        if (!constructors) {
            return;
        }

        while (constructors[++iterator]) {
            callbacks = constructors[iterator].callbacks;

            if (callbacks) {
                fire(self, callbacks[name], args);
            }
        }
    };

    prototype.trigger = function (name) {
        var self = this,
            args = arraySlice.call(arguments, 1),
            callbacks;

        while (self) {
            callbacks = self.callbacks;
            if (callbacks) {
                fire(self, callbacks[name], args);
            }

            callbacks = self.constructor.callbacks;
            if (callbacks) {
                fire(self, callbacks[name], args);
            }

            self = self.parent;
        }
    };

    /**
     * Inherit the contexts' (Super) prototype into a given Constructor. E.g.,
     * Node is implemented by Parent, Parent is implemented by RootNode, &c.
     *
     * @param {function} Constructor
     * @api public
     */
    Node.isImplementedBy = function (Constructor) {
        var self = this,
            constructors = self.constructors || [self],
            constructorPrototype, key, newPrototype;

        constructors = [Constructor].concat(constructors);

        constructorPrototype = Constructor.prototype;

        function AltConstructor () {}
        AltConstructor.prototype = self.prototype;
        newPrototype = new AltConstructor();

        for (key in constructorPrototype) {
            /* Note: Code climate, and probably other linters, will fail
             * here. Thats okay, their wrong. */
            newPrototype[key] = constructorPrototype[key];
        }

        if (constructorPrototype.toString !== {}.toString) {
            newPrototype.toString = constructorPrototype.toString;
        }

        for (key in self) {
            /* istanbul ignore else */
            if (self.hasOwnProperty(key)) {
                Constructor[key] = self[key];
            }
        }

        newPrototype.constructor = Constructor;
        Constructor.constructors = constructors;
        Constructor.prototype = newPrototype;
    };

    /**
     * Expose Parent. Constructs a new Parent node;
     *
     * @api public
     * @constructor
     */
    function Parent() {
        Node.apply(this, arguments);
    }

    prototype = Parent.prototype;

    /**
     * The first child of a parent, null otherwise.
     *
     * @api public
     * @type {?Child}
     * @readonly
     */
    prototype.head = null;

    /**
     * The last child of a parent (unless the last child is also the first
     * child), null otherwise.
     *
     * @api public
     * @type {?Child}
     * @readonly
     */
    prototype.tail = null;

    /**
     * The number of children in a parent.
     *
     * @api public
     * @type {number}
     * @readonly
     */
    prototype.length = 0;

    /**
     * Insert a child at the beginning of the list (like Array#unshift).
     *
     * @param {Child} child - the child to insert as the (new) FIRST child
     * @return {Child} - the given child.
     * @api public
     */
    prototype.prepend = function (child) {
        return insert(this, null, child);
    };

    /**
     * Insert a child at the end of the list (like Array#push).
     *
     * @param {Child} child - the child to insert as the (new) LAST child
     * @return {Child} - the given child.
     * @api public
     */
    prototype.append = function (child) {
        return insert(this, this.tail || this.head, child);
    };

    /**
     * Return a child at given position in parent, and null otherwise. (like
     * NodeList#item).
     *
     * @param {?number} [index=0] - the position to find a child at.
     * @return {Child?} - the found child, or null.
     * @api public
     */
    prototype.item = function (index) {
        if (index === null || index === undefined) {
            index = 0;
        } else if (typeof index !== 'number' || index !== index) {
            throw new TypeError('\'' + index + ' is not a valid argument ' +
                'for \'Parent.prototype.item\'');
        }

        return this[index] || null;
    };

    /**
     * Split the Parent into two, dividing the children from 0-position (NOT
     * including the character at `position`), and position-length (including
     * the character at `position`).
     *
     * @param {?number} [position=0] - the position to split at.
     * @return {Parent} - the prepended parent.
     * @api public
     */
    prototype.split = function (position) {
        var self = this,
            clone, cloneNode, iterator;

        position = validateSplitPosition(position, self.length);

        /* This throws if we're not attached, thus preventing appending. */
        /*eslint-disable new-cap */
        cloneNode = insert(self.parent, self.prev, new self.constructor());
        /*eslint-enable new-cap */

        clone = arraySlice.call(self);
        iterator = -1;

        while (++iterator < position && clone[iterator]) {
            cloneNode.append(clone[iterator]);
        }

        return cloneNode;
    };

    /**
     * Return the result of calling `toString` on each of `Parent`s children.
     *
     * NOTE The `toString` method is intentionally generic; It can be
     * transferred to other kinds of (linked-list-like) objects for use as a
     * method.
     *
     * @return {String}
     * @api public
     */
    prototype.toString = function () {
        var value, node;

        value = '';
        node = this.head;

        while (node) {
            value += node;
            node = node.next;
        }

        return value;
    };

    /**
     * Inherit from `Node.prototype`.
     */
    Node.isImplementedBy(Parent);

    /**
     * Expose Child. Constructs a new Child node;
     *
     * @api public
     * @constructor
     */
    function Child() {
        Node.apply(this, arguments);
    }

    prototype = Child.prototype;

    /**
     * The parent node, null otherwise (when the child is detached).
     *
     * @api public
     * @type {?Parent}
     * @readonly
     */
    prototype.parent = null;

    /**
     * The next node, null otherwise (when `child` is the parents last child
     * or detached).
     *
     * @api public
     * @type {?Child}
     * @readonly
     */
    prototype.next = null;

    /**
     * The previous node, null otherwise (when `child` is the parents first
     * child or detached).
     *
     * @api public
     * @type {?Child}
     * @readonly
     */
    prototype.prev = null;

    /**
     * Insert a given child before the operated on child in the parent.
     *
     * @param {Child} child - the child to insert before the operated on
     *                        child.
     * @return {Child} - the given child.
     * @api public
     */
    prototype.before = function (child) {
        return insert(this.parent, this.prev, child);
    };

    /**
     * Insert a given child after the operated on child in the parent.
     *
     * @param {Child} child - the child to insert after the operated on child.
     * @return {Child} - the given child.
     * @api public
     */
    prototype.after = function (child) {
        return insert(this.parent, this, child);
    };

    /**
     * Remove the operated on child, and insert a given child at its previous
     * position in the parent.
     *
     * @param {Child} child - the child to replace the operated on child with.
     * @return {Child} - the given child.
     * @api public
     */
    prototype.replace = function (child) {
        var result = insert(this.parent, this, child);

        remove(this);

        return result;
    };

    /**
     * Remove the operated on child.
     *
     * @return {Child} - the operated on child.
     * @api public
     */
    prototype.remove = function () {
        return remove(this);
    };

    /**
     * Inherit from `Node.prototype`.
     */
    Node.isImplementedBy(Child);

    /**
     * Expose Element. Constructs a new Element node;
     *
     * @api public
     * @constructor
     */
    function Element() {
        Parent.apply(this, arguments);
        Child.apply(this, arguments);
    }

    /**
     * Inherit from `Parent.prototype` and `Child.prototype`.
     */
    Parent.isImplementedBy(Element);
    Child.isImplementedBy(Element);

    /* Add Parent as a constructor (which it is) */
    Element.constructors.splice(2, 0, Parent);

    /**
     * Expose Text. Constructs a new Text node;
     *
     * @api public
     * @constructor
     */
    function Text(value) {
        Child.apply(this, arguments);

        this.fromString(value);
    }

    prototype = Text.prototype;

    /**
     * The internal value.
     *
     * @api private
     */
    prototype.internalValue = '';

    /**
     * Return the internal value of a Text;
     *
     * @return {String}
     * @api public
     */
    prototype.toString = function () {
        return this.internalValue;
    };

    /**
     * (Re)sets and returns the internal value of a Text with the stringified
     * version of the given value.
     *
     * @param {?String} [value=''] - the value to set
     * @return {String}
     * @api public
     */
    prototype.fromString = function (value) {
        var self = this,
            previousValue = self.toString(),
            parent;

        if (value === null || value === undefined) {
            value = '';
        } else {
            value = value.toString();
        }

        if (value !== previousValue) {
            self.internalValue = value;

            self.emit('changetext', value, previousValue);

            parent = self.parent;
            if (parent) {
                parent.trigger(
                    'changetextinside', self, value, previousValue
                );
            }
        }

        return value;
    };

    /**
     * Split the Text into two, dividing the internal value from 0-position
     * (NOT including the character at `position`), and position-length
     * (including the character at `position`).
     *
     * @param {?number} [position=0] - the position to split at.
     * @return {Child} - the prepended child.
     * @api public
     */
    prototype.split = function (position) {
        var self = this,
            value = self.internalValue,
            cloneNode;

        position = validateSplitPosition(position, value.length);

        /* This throws if we're not attached, thus preventing substringing. */
        /*eslint-disable new-cap */
        cloneNode = insert(self.parent, self.prev, new self.constructor());
        /*eslint-enable new-cap */

        self.fromString(value.slice(position));
        cloneNode.fromString(value.slice(0, position));

        return cloneNode;
    };

    /**
     * Inherit from `Child.prototype`.
     */
    Child.isImplementedBy(Text);

    /**
     * Expose RootNode. Constructs a new RootNode (inheriting from Parent);
     *
     * @api public
     * @constructor
     */
    function RootNode() {
        Parent.apply(this, arguments);
    }

    /**
     * The type of an instance of RootNode.
     *
     * @api public
     * @readonly
     * @static
     */
    RootNode.prototype.type = ROOT_NODE;

    RootNode.prototype.allowedChildTypes = [
        PARAGRAPH_NODE,
        WHITE_SPACE_NODE,
        SOURCE_NODE
    ];

    /**
     * Inherit from `Parent.prototype`.
     */
    Parent.isImplementedBy(RootNode);

    /**
     * Expose ParagraphNode. Constructs a new ParagraphNode (inheriting from
     * both Parent and Child);
     *
     * @api public
     * @constructor
     */
    function ParagraphNode() {
        Element.apply(this, arguments);
    }

    /**
     * The type of an instance of ParagraphNode.
     *
     * @api public
     * @readonly
     * @static
     */
    ParagraphNode.prototype.type = PARAGRAPH_NODE;

    ParagraphNode.prototype.allowedChildTypes = [
        SENTENCE_NODE,
        WHITE_SPACE_NODE,
        SOURCE_NODE
    ];

    /**
     * Inherit from `Parent.prototype` and `Child.prototype`.
     */
    Element.isImplementedBy(ParagraphNode);

    /**
     * Expose SentenceNode. Constructs a new SentenceNode (inheriting from
     * both Parent and Child);
     *
     * @api public
     * @constructor
     */
    function SentenceNode() {
        Element.apply(this, arguments);
    }

    /**
     * The type of an instance of SentenceNode.
     *
     * @api public
     * @readonly
     * @static
     */
    SentenceNode.prototype.type = SENTENCE_NODE;

    SentenceNode.prototype.allowedChildTypes = [
        WORD_NODE, PUNCTUATION_NODE, WHITE_SPACE_NODE, SOURCE_NODE
    ];

    /**
     * Inherit from `Parent.prototype` and `Child.prototype`.
     */
    Element.isImplementedBy(SentenceNode);

    /**
     * Expose WordNode.
     */
    function WordNode() {
        Element.apply(this, arguments);
    }

    /**
     * The type of an instance of WordNode.
     *
     * @api public
     * @readonly
     * @static
     */
    WordNode.prototype.type = WORD_NODE;

    WordNode.prototype.allowedChildTypes = [TEXT_NODE, PUNCTUATION_NODE];

    /**
     * Inherit from `Text.prototype`.
     */
    Element.isImplementedBy(WordNode);

    /**
     * Expose PunctuationNode.
     */
    function PunctuationNode() {
        Element.apply(this, arguments);
    }

    /**
     * The type of an instance of PunctuationNode.
     *
     * @api public
     * @readonly
     * @static
     */
    PunctuationNode.prototype.type = PUNCTUATION_NODE;

    PunctuationNode.prototype.allowedChildTypes = [TEXT_NODE];

    /**
     * Inherit from `Text.prototype`.
     */
    Element.isImplementedBy(PunctuationNode);

    /**
     * Expose WhiteSpaceNode.
     */
    function WhiteSpaceNode() {
        PunctuationNode.apply(this, arguments);
    }

    /**
     * The type of an instance of WhiteSpaceNode.
     *
     * @api public
     * @readonly
     * @static
     */
    WhiteSpaceNode.prototype.type = WHITE_SPACE_NODE;

    WhiteSpaceNode.prototype.allowedChildTypes = [TEXT_NODE];

    /**
     * Inherit from `Text.prototype`.
     */
    PunctuationNode.isImplementedBy(WhiteSpaceNode);

    /**
     * Expose SourceNode.
     */
    function SourceNode() {
        Text.apply(this, arguments);
    }

    /**
     * The type of an instance of SourceNode.
     *
     * @api public
     * @readonly
     * @static
     */
    SourceNode.prototype.type = SOURCE_NODE;

    /**
     * Inherit from `Text.prototype`.
     */
    Text.isImplementedBy(SourceNode);

    /**
     * Expose TextNode.
     */
    function TextNode() {
        Text.apply(this, arguments);
    }

    /**
     * The type of an instance of TextNode.
     *
     * @api public
     * @readonly
     * @static
     */
    TextNode.prototype.type = TEXT_NODE;

    /**
     * Inherit from `Text.prototype`.
     */
    Text.isImplementedBy(TextNode);

    var nodePrototype = Node.prototype,
        TextOM;

    /**
     * Define the `TextOM` object.
     * Expose `TextOM` on every instance of Node.
     *
     * @api public
     */
    nodePrototype.TextOM = TextOM = {};

    /**
     * Export all node types to `TextOM` and `Node#`.
     */
    TextOM.ROOT_NODE = nodePrototype.ROOT_NODE = ROOT_NODE;
    TextOM.PARAGRAPH_NODE = nodePrototype.PARAGRAPH_NODE = PARAGRAPH_NODE;
    TextOM.SENTENCE_NODE = nodePrototype.SENTENCE_NODE = SENTENCE_NODE;
    TextOM.WORD_NODE = nodePrototype.WORD_NODE = WORD_NODE;
    TextOM.PUNCTUATION_NODE = nodePrototype.PUNCTUATION_NODE =
        PUNCTUATION_NODE;
    TextOM.WHITE_SPACE_NODE = nodePrototype.WHITE_SPACE_NODE =
        WHITE_SPACE_NODE;
    TextOM.SOURCE_NODE = nodePrototype.SOURCE_NODE = SOURCE_NODE;
    TextOM.TEXT_NODE = nodePrototype.TEXT_NODE = TEXT_NODE;

    /**
     * Export all `Node`s to `TextOM`.
     */
    TextOM.Node = Node;
    TextOM.Parent = Parent;
    TextOM.Child = Child;
    TextOM.Element = Element;
    TextOM.Text = Text;
    TextOM.RootNode = RootNode;
    TextOM.ParagraphNode = ParagraphNode;
    TextOM.SentenceNode = SentenceNode;
    TextOM.WordNode = WordNode;
    TextOM.PunctuationNode = PunctuationNode;
    TextOM.WhiteSpaceNode = WhiteSpaceNode;
    TextOM.SourceNode = SourceNode;
    TextOM.TextNode = TextNode;

    /**
     * Expose `TextOM`. Used to instantiate a new `RootNode`.
     */
    return TextOM;
}

module.exports = TextOMConstructor;

});

require.register("visionmedia~co@3.1.0", function (exports, module) {

/**
 * slice() reference.
 */

var slice = Array.prototype.slice;

/**
 * Expose `co`.
 */

module.exports = co;

/**
 * Wrap the given generator `fn` and
 * return a thunk.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function co(fn) {
  var isGenFun = isGeneratorFunction(fn);

  return function (done) {
    var ctx = this;

    // in toThunk() below we invoke co()
    // with a generator, so optimize for
    // this case
    var gen = fn;

    // we only need to parse the arguments
    // if gen is a generator function.
    if (isGenFun) {
      var args = slice.call(arguments), len = args.length;
      var hasCallback = len && 'function' == typeof args[len - 1];
      done = hasCallback ? args.pop() : error;
      gen = fn.apply(this, args);
    } else {
      done = done || error;
    }

    next();

    // #92
    // wrap the callback in a setImmediate
    // so that any of its errors aren't caught by `co`
    function exit(err, res) {
      setImmediate(function(){
        done.call(ctx, err, res);
      });
    }

    function next(err, res) {
      var ret;

      // multiple args
      if (arguments.length > 2) res = slice.call(arguments, 1);

      // error
      if (err) {
        try {
          ret = gen.throw(err);
        } catch (e) {
          return exit(e);
        }
      }

      // ok
      if (!err) {
        try {
          ret = gen.next(res);
        } catch (e) {
          return exit(e);
        }
      }

      // done
      if (ret.done) return exit(null, ret.value);

      // normalize
      ret.value = toThunk(ret.value, ctx);

      // run
      if ('function' == typeof ret.value) {
        var called = false;
        try {
          ret.value.call(ctx, function(){
            if (called) return;
            called = true;
            next.apply(ctx, arguments);
          });
        } catch (e) {
          setImmediate(function(){
            if (called) return;
            called = true;
            next(e);
          });
        }
        return;
      }

      // invalid
      next(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following was passed: "' + String(ret.value) + '"'));
    }
  }
}

/**
 * Convert `obj` into a normalized thunk.
 *
 * @param {Mixed} obj
 * @param {Mixed} ctx
 * @return {Function}
 * @api private
 */

function toThunk(obj, ctx) {

  if (isGeneratorFunction(obj)) {
    return co(obj.call(ctx));
  }

  if (isGenerator(obj)) {
    return co(obj);
  }

  if (isPromise(obj)) {
    return promiseToThunk(obj);
  }

  if ('function' == typeof obj) {
    return obj;
  }

  if (isObject(obj) || Array.isArray(obj)) {
    return objectToThunk.call(ctx, obj);
  }

  return obj;
}

/**
 * Convert an object of yieldables to a thunk.
 *
 * @param {Object} obj
 * @return {Function}
 * @api private
 */

function objectToThunk(obj){
  var ctx = this;
  var isArray = Array.isArray(obj);

  return function(done){
    var keys = Object.keys(obj);
    var pending = keys.length;
    var results = isArray
      ? new Array(pending) // predefine the array length
      : new obj.constructor();
    var finished;

    if (!pending) {
      setImmediate(function(){
        done(null, results)
      });
      return;
    }

    // prepopulate object keys to preserve key ordering
    if (!isArray) {
      for (var i = 0; i < pending; i++) {
        results[keys[i]] = undefined;
      }
    }

    for (var i = 0; i < keys.length; i++) {
      run(obj[keys[i]], keys[i]);
    }

    function run(fn, key) {
      if (finished) return;
      try {
        fn = toThunk(fn, ctx);

        if ('function' != typeof fn) {
          results[key] = fn;
          return --pending || done(null, results);
        }

        fn.call(ctx, function(err, res){
          if (finished) return;

          if (err) {
            finished = true;
            return done(err);
          }

          results[key] = res;
          --pending || done(null, results);
        });
      } catch (err) {
        finished = true;
        done(err);
      }
    }
  }
}

/**
 * Convert `promise` to a thunk.
 *
 * @param {Object} promise
 * @return {Function}
 * @api private
 */

function promiseToThunk(promise) {
  return function(fn){
    promise.then(function(res) {
      fn(null, res);
    }, fn);
  }
}

/**
 * Check if `obj` is a promise.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isPromise(obj) {
  return obj && 'function' == typeof obj.then;
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGenerator(obj) {
  return obj && 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGeneratorFunction(obj) {
  return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name;
}

/**
 * Check for plain object.
 *
 * @param {Mixed} val
 * @return {Boolean}
 * @api private
 */

function isObject(val) {
  return val && Object == val.constructor;
}

/**
 * Throw `err` in a new stack.
 *
 * This is used when co() is invoked
 * without supplying a callback, which
 * should only be for demonstrational
 * purposes.
 *
 * @param {Error} err
 * @api private
 */

function error(err) {
  if (!err) return;
  setImmediate(function(){
    throw err;
  });
}

});

require.register("matthewmueller~wrap-fn@0.1.1", function (exports, module) {
/**
 * Module Dependencies
 */

var slice = [].slice;
var co = require("visionmedia~co@3.1.0");
var noop = function(){};

/**
 * Export `wrap-fn`
 */

module.exports = wrap;

/**
 * Wrap a function to support
 * sync, async, and gen functions.
 *
 * @param {Function} fn
 * @param {Function} done
 * @return {Function}
 * @api public
 */

function wrap(fn, done) {
  done = done || noop;

  return function() {
    var args = slice.call(arguments);
    var ctx = this;

    // done
    if (!fn) {
      return done.apply(ctx, [null].concat(args));
    }

    // async
    if (fn.length > args.length) {
      return fn.apply(ctx, args.concat(done));
    }

    // generator
    if (generator(fn)) {
      return co(fn).apply(ctx, args.concat(done));
    }

    // sync
    return sync(fn, done).apply(ctx, args);
  }
}

/**
 * Wrap a synchronous function execution.
 *
 * @param {Function} fn
 * @param {Function} done
 * @return {Function}
 * @api private
 */

function sync(fn, done) {
  return function () {
    var ret;

    try {
      ret = fn.apply(this, arguments);
    } catch (err) {
      return done(err);
    }

    if (promise(ret)) {
      ret.then(function (value) { done(null, value); }, done);
    } else {
      ret instanceof Error ? done(ret) : done(null, ret);
    }
  }
}

/**
 * Is `value` a generator?
 *
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function generator(value) {
  return value
    && value.constructor
    && 'GeneratorFunction' == value.constructor.name;
}


/**
 * Is `value` a promise?
 *
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function promise(value) {
  return value && 'function' == typeof value.then;
}

});

require.register("segmentio~ware@1.2.0", function (exports, module) {
/**
 * Module Dependencies
 */

var slice = [].slice;
var wrap = require("matthewmueller~wrap-fn@0.1.1");

/**
 * Expose `Ware`.
 */

module.exports = Ware;

/**
 * Initialize a new `Ware` manager, with optional `fns`.
 *
 * @param {Function or Array or Ware} fn (optional)
 */

function Ware (fn) {
  if (!(this instanceof Ware)) return new Ware(fn);
  this.fns = [];
  if (fn) this.use(fn);
}

/**
 * Use a middleware `fn`.
 *
 * @param {Function or Array or Ware} fn
 * @return {Ware}
 */

Ware.prototype.use = function (fn) {
  if (fn instanceof Ware) {
    return this.use(fn.fns);
  }

  if (fn instanceof Array) {
    for (var i = 0, f; f = fn[i++];) this.use(f);
    return this;
  }

  this.fns.push(fn);
  return this;
};

/**
 * Run through the middleware with the given `args` and optional `callback`.
 *
 * @param {Mixed} args...
 * @param {Function} callback (optional)
 * @return {Ware}
 */

Ware.prototype.run = function () {
  var fns = this.fns;
  var ctx = this;
  var i = 0;
  var last = arguments[arguments.length - 1];
  var done = 'function' == typeof last && last;
  var args = done
    ? slice.call(arguments, 0, arguments.length - 1)
    : slice.call(arguments);

  // next step
  function next (err) {
    if (err) return done(err);
    var fn = fns[i++];
    var arr = slice.call(args);

    if (!fn) {
      return done && done.apply(null, [null].concat(args));
    }

    wrap(fn, next).apply(ctx, arr);
  }

  next();

  return this;
};

});

require.register("wooorm~retext@0.2.0-rc.3", function (exports, module) {
'use strict';

var TextOMConstructor,
    ParseLatin,
    Ware,
    has;

/**
 * Module dependencies.
 */

TextOMConstructor = require("wooorm~textom@0.1.1");
ParseLatin = require("wooorm~parse-latin@0.1.3");
Ware = require("segmentio~ware@1.2.0");

/**
 * Cached, fast, secure existence test.
 */

has = Object.prototype.hasOwnProperty;

/**
 * Transform a concrete syntax tree into a tree constructed
 * from a given object model.
 *
 * @param {Object} TextOM - the object model.
 * @param {Object} cst - the concrete syntax tree to
 *   transform.
 * @return {Node} the node constructed from the
 *   CST and the object model.
 */

function fromCST(TextOM, cst) {
    var index,
        node,
        children,
        data,
        attribute;

    node = new TextOM[cst.type]();

    if ('children' in cst) {
        index = -1;
        children = cst.children;

        while (children[++index]) {
            node.append(fromCST(TextOM, children[index]));
        }
    } else {
        node.fromString(cst.value);
    }

    /**
     * Currently, `data` properties are not really
     * specified or documented. Therefore, the following
     * branch is ignored by Istanbul.
     *
     * The idea is that plugins and parsers can each
     * attach data to nodes, in a similar fashion to the
     * DOMs dataset, which can be stringified and parsed
     * back and forth between the concrete syntax tree
     * and the node.
     */

    /* istanbul ignore if: TODO, Untestable, will change soon. */
    if ('data' in cst) {
        data = cst.data;

        for (attribute in data) {
            if (has.call(data, attribute)) {
                node.data[attribute] = data[attribute];
            }
        }
    }

    return node;
}

/**
 * Construct an instance of `Retext`.
 *
 * @param {Function?} parser - the parser to use. Defaults
 *   to a new instance of `parse-latin`.
 * @constructor
 */

function Retext(parser) {
    var self,
        TextOM;

    if (!parser) {
        parser = new ParseLatin();
    }

    self = this;
    TextOM = new TextOMConstructor();

    self.ware = new Ware();
    self.parser = parser;
    self.TextOM = TextOM;

    /**
     * Expose `TextOM` on `parser`, and vice versa.
     */

    parser.TextOM = TextOM;
    TextOM.parser = parser;
}

/**
 * Attaches `plugin`: a humble function.
 *
 * When `parse` or `run` is invoked, `plugin` is
 * invoked with `node` and a `retext` instance.
 *
 * If `plugin` contains asynchronous functionality, it
 * should accept a third argument (`next`) and invoke
 * it on completion.
 *
 * `plugin.attach` is invoked with a `retext` instance
 * when attached, enabling `plugin` to depend on other
 * plugins.
 *
 * Code to initialize `plugin` should go into its `attach`
 * method, such as functionality to modify the object model
 * (TextOM), the parser (e.g., `parse-latin`), or the
 * `retext` instance. `plugin.attach` is invoked when
 * `plugin` is attached to a `retext` instance.
 *
 * @param {function(Node, Retext, Function?)} plugin -
 *   functionality to analyze and manipulate a node.
 * @param {function(Retext)} plugin.attach - functionality
 *   to initialize `plugin`.
 * @return this
 */

Retext.prototype.use = function (plugin) {
    var self;

    if (typeof plugin !== 'function') {
        throw new TypeError(
            'Illegal invocation: `' + plugin + '` ' +
            'is not a valid argument for `Retext#use(plugin)`'
        );
    }

    self = this;

    if (self.ware.fns.indexOf(plugin) === -1) {
        self.ware.use(plugin);

        if (plugin.attach) {
            plugin.attach(self);
        }
    }

    return self;
};

/**
 * Transform a given value into a node, applies attached
 * plugins to the node, and invokes `done` with either an
 * error (first argument) or the transformed node (second
 * argument).
 *
 * @param {string?} value - The value to transform.
 * @param {function(Error, Node)} done - Callback to
 *   invoke when the transformations have completed.
 * @return this
 */

Retext.prototype.parse = function (value, done) {
    var self,
        cst;

    if (typeof done !== 'function') {
        throw new TypeError(
            'Illegal invocation: `' + done + '` ' +
            'is not a valid argument for `Retext#parse(value, done)`.\n' +
            'This breaking change occurred in 0.2.0-rc.1, see GitHub for ' +
            'more information.'
        );
    }

    self = this;

    cst = self.parser.parse(value);

    self.run(fromCST(self.TextOM, cst), done);

    return self;
};

/**
 * Applies attached plugins to `node` and invokes `done`
 * with either an error (first argument) or the transformed
 * `node` (second argument).
 *
 * @param {Node} node - The node to apply attached
 *   plugins to.
 * @param {function(Error, Node)} done - Callback to
 *   invoke when the transformations have completed.
 * @return this
 */

Retext.prototype.run = function (node, done) {
    var self;

    if (typeof done !== 'function') {
        throw new TypeError(
            'Illegal invocation: `' + done + '` ' +
            'is not a valid argument for ' +
            '`Retext#run(node, done)`.\n' +
            'This breaking change occurred in 0.2.0-rc.1, see GitHub for ' +
            'more information.'
        );
    }

    self = this;

    self.ware.run(node, self, done);

    return self;
};

/**
 * Expose `Retext`.
 */

module.exports = Retext;

});

require.register("wooorm~retext-visit@0.1.1", function (exports, module) {
'use strict';

/**
 * Define `plugin`.
 */

function plugin() {}

/**
 * Invoke `callback` for every descendant of the
 * operated on context.
 *
 * @param {function(Node): boolean?} callback - Visitor.
 *   Stops visiting when the return value is `false`.
 * @this {Node} Context to search in.
 */

function visit(callback) {
    var node,
        next;

    node = this.head;

    while (node) {
        /**
         * Allow for removal of the node by `callback`.
         */

        next = node.next;

        if (callback(node) === false) {
            return;
        }

        /**
         * If possible, invoke the node's own `visit`
         *  method, otherwise call retext-visit's
         * `visit` method.
         */

        (node.visit || visit).call(node, callback);

        node = next;
    }
}

/**
 * Invoke `callback` for every descendant with a given
 * `type` in the operated on context.
 *
 * @param {string} type - Type of a node.
 * @param {function(Node): boolean?} callback - Visitor.
 *   Stops visiting when the return value is `false`.
 * @this {Node} Context to search in.
 */

function visitType(type, callback) {
    /**
     * A wrapper for `callback` to check it the node's
     * type property matches `type`.
     *
     * @param {node} type - Descendant.
     * @return {*} Passes `callback`s return value
     *   through.
     */

    function wrapper(node) {
        if (node.type === type) {
            return callback(node);
        }
    }

    this.visit(wrapper);
}

function attach(retext) {
    var TextOM,
        parentPrototype,
        elementPrototype;

    TextOM = retext.TextOM;
    parentPrototype = TextOM.Parent.prototype;
    elementPrototype = TextOM.Element.prototype;

    /**
     * Expose `visit` and `visitType` on Parents.
     *
     * Due to multiple inheritance of Elements (Parent
     * and Child), these methods are explicitly added.
     */

    elementPrototype.visit = parentPrototype.visit = visit;
    elementPrototype.visitType = parentPrototype.visitType = visitType;
}

/**
 * Expose `attach`.
 */

plugin.attach = attach;

/**
 * Expose `plugin`.
 */

exports = module.exports = plugin;

});

require.register("wooorm~retext-dom@0.1.3", function (exports, module) {
'use strict';

var visit;

/**
 * Module dependencies.
 */

visit = require("wooorm~retext-visit@0.1.1");

/**
 * Throw when not running in the browser (or a
 * simulated browser environment).
 */

/* istanbul ignore if */
if (typeof document !== 'object') {
    throw new Error(
        'Missing document object for `retext-dom`.'
    );
}

/**
 * Event handler for an inserted TextOM node.
 *
 * @param {Node} node - Insertion.
 */

function oninsertinside(node) {
    node.parent.toDOMNode().insertBefore(node.toDOMNode(),
        node.prev ? node.prev.toDOMNode().nextSibling : null
    );
}

/**
 * Event handler for a removed TextOM node.
 *
 * @param {Node} node - Deletion.
 */

function onremoveinside(node, previousParent) {
    previousParent.toDOMNode().removeChild(node.toDOMNode());
}

/**
 * Event handler for a value-change in a TextOM text
 * node.
 *
 * @param {Node} node - Changed node.
 */

function onchangetextinside(node, newValue) {
    node.toDOMNode().textContent = newValue;
}

/**
 * Get the DOM node-equivalent from a TextOM node.
 *
 * On initial run, a DOM node is created. If a
 * `DOMTagName` property exists on the context
 * a DOM text node is created. Otherwise, an
 * DOM element is created of type `DOMTagName`.
 *
 *
 * @this {Node}
 * @return {Node} DOM node.
 */

function toDOMNode() {
    var self,
        DOMNode;

    self = this;
    DOMNode = self.DOMNode;

    if (!DOMNode) {
        if (!self.DOMTagName) {
            DOMNode = document.createTextNode('');
        } else {
            DOMNode = document.createElement(self.DOMTagName);
        }

        /**
         * Store DOM node on context.
         */

        self.DOMNode = DOMNode;

        /**
         * Store context on DOM node.
         */

        DOMNode.TextOMNode = self;
    }

    return DOMNode;
}

/**
 * Define `plugin`.
 *
 * @param {Node} tree - TextOM node.
 */

function plugin(tree) {
    tree.on('insertinside', oninsertinside);
    tree.on('removeinside', onremoveinside);
    tree.on('changetextinside', onchangetextinside);

    /**
     * Make sure a parent DOM node, to attach to,
     * exists.
     */

    tree.toDOMNode();

    tree.visit(function (node) {
        oninsertinside(node);

        if (node instanceof node.TextOM.Text) {
            onchangetextinside(node, node.toString(), null);
        }
    });
}

/**
 * Define `attach`.
 *
 * @param {Retext} retext - Instance of Retext.
 */

function attach(retext) {
    var TextOM;

    /**
     * Depend on `retext-visit`.
     */

    retext.use(visit);

    TextOM = retext.TextOM;

    TextOM.Node.prototype.toDOMNode = toDOMNode;

    TextOM.Node.prototype.DOMTagName = 'span';
    TextOM.RootNode.prototype.DOMTagName = 'div';
    TextOM.ParagraphNode.prototype.DOMTagName = 'p';

    TextOM.Text.prototype.DOMTagName = null;
}

/**
 * Expose `attach`.
 */

plugin.attach = attach;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

});

require.register("wooorm~stemmer@0.1.1", function (exports, module) {
'use strict';

var step2list, step3list, consonant, vowel, consonantSequence,
    vowelSequence, EXPRESSION_MEASURE_GREATER_THAN_0,
    EXPRESSION_MEASURE_EQUAL_TO_1, EXPRESSION_MEASURE_GREATER_THAN_1,
    EXPRESSION_VOWEL_IN_STEM, EXPRESSION_CONSONANT_LIKE,
    EXPRESSION_SUFFIX_LL, EXPRESSION_SUFFIX_E, EXPRESSION_SUFFIX_Y,
    EXPRESSION_SUFFIX_ION, EXPRESSION_SUFFIX_ED_OR_ING,
    EXPRESSION_SUFFIX_AT_OR_BL_OR_IZ, EXPRESSION_SUFFIX_EED,
    EXPRESSION_SUFFIX_S, EXPRESSION_SUFFIX_SSES_OR_IES,
    EXPRESSION_SUFFIX_MULTI_CONSONANT_LIKE, EXPRESSION_STEP_2,
    EXPRESSION_STEP_3, EXPRESSION_STEP_4;

step2list = {
    'ational' : 'ate',
    'tional' : 'tion',
    'enci' : 'ence',
    'anci' : 'ance',
    'izer' : 'ize',
    'bli' : 'ble',
    'alli' : 'al',
    'entli' : 'ent',
    'eli' : 'e',
    'ousli' : 'ous',
    'ization' : 'ize',
    'ation' : 'ate',
    'ator' : 'ate',
    'alism' : 'al',
    'iveness' : 'ive',
    'fulness' : 'ful',
    'ousness' : 'ous',
    'aliti' : 'al',
    'iviti' : 'ive',
    'biliti' : 'ble',
    'logi' : 'log'
};

step3list = {
    'icate' : 'ic',
    'ative' : '',
    'alize' : 'al',
    'iciti' : 'ic',
    'ical' : 'ic',
    'ful' : '',
    'ness' : ''
};

consonant = '[^aeiou]';
vowel = '[aeiouy]';
consonantSequence = '(' + consonant + '[^aeiouy]*)';
vowelSequence = '(' + vowel + '[aeiou]*)';

EXPRESSION_MEASURE_GREATER_THAN_0 = new RegExp(
    '^' + consonantSequence + '?' + vowelSequence + consonantSequence
);

EXPRESSION_MEASURE_EQUAL_TO_1 = new RegExp(
    '^' + consonantSequence + '?' + vowelSequence + consonantSequence +
    vowelSequence + '?$'
);

EXPRESSION_MEASURE_GREATER_THAN_1 = new RegExp(
    '^' + consonantSequence + '?' + '(' + vowelSequence +
    consonantSequence + '){2,}'
);

EXPRESSION_VOWEL_IN_STEM = new RegExp(
    '^' + consonantSequence + '?' + vowel
);

EXPRESSION_CONSONANT_LIKE = new RegExp(
    '^' + consonantSequence + vowel + '[^aeiouwxy]$'
);

EXPRESSION_SUFFIX_LL = /ll$/;
EXPRESSION_SUFFIX_E = /^(.+?)e$/;
EXPRESSION_SUFFIX_Y = /^(.+?)y$/;
EXPRESSION_SUFFIX_ION = /^(.+?(s|t))(ion)$/;
EXPRESSION_SUFFIX_ED_OR_ING = /^(.+?)(ed|ing)$/;
EXPRESSION_SUFFIX_AT_OR_BL_OR_IZ = /(at|bl|iz)$/;
EXPRESSION_SUFFIX_EED = /^(.+?)eed$/;
EXPRESSION_SUFFIX_S = /^.+?[^s]s$/;
EXPRESSION_SUFFIX_SSES_OR_IES = /^.+?(ss|i)es$/;
EXPRESSION_SUFFIX_MULTI_CONSONANT_LIKE = /([^aeiouylsz])\1$/;
EXPRESSION_STEP_2 = new RegExp(
    '^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|' +
    'ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|' +
    'biliti|logi)$'
);
EXPRESSION_STEP_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
EXPRESSION_STEP_4 = new RegExp(
    '^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|' +
    'iti|ous|ive|ize)$'
);

function stemmer(value) {
    var firstCharacterWasLowerCaseY, match;

    value = value.toString().toLowerCase();

    if (value.length < 3) {
        return value;
    }

    if (value[0] === 'y') {
        firstCharacterWasLowerCaseY = true;
        value = 'Y' + value.substr(1);
    }

    /* Step 1a */
    if (EXPRESSION_SUFFIX_SSES_OR_IES.test(value)) {
        /* Remove last two characters from input. */
        value = value.slice(0, -2);
    } else if (EXPRESSION_SUFFIX_S.test(value)) {
        /* Remove last character from input. */
        value = value.slice(0, -1);
    }

    /* Step 1b */
    if (match = EXPRESSION_SUFFIX_EED.exec(value)) {
        if (EXPRESSION_MEASURE_GREATER_THAN_0.test(match[1])) {
            /* Remove last character from input. */
            value = value.slice(0, -1);
        }
    } else if (
        (match = EXPRESSION_SUFFIX_ED_OR_ING.exec(value)) &&
        EXPRESSION_VOWEL_IN_STEM.test(match[1])
    ) {
        value = match[1];

        if (EXPRESSION_SUFFIX_AT_OR_BL_OR_IZ.test(value)) {
            /* Append `e` to input. */
            value += 'e';
        } else if (
            EXPRESSION_SUFFIX_MULTI_CONSONANT_LIKE.test(value)
        ) {
            /* Remove last character from input. */
            value = value.slice(0, -1);
        } else if (EXPRESSION_CONSONANT_LIKE.test(value)) {
            /* Append `e` to input. */
            value += 'e';
        }
    }

    /* Step 1c */
    if (
        (match = EXPRESSION_SUFFIX_Y.exec(value)) &&
        EXPRESSION_VOWEL_IN_STEM.test(match[1])
    ) {
        /* Remove suffixing `y`, and append `i` to input. */
        value = match[1] + 'i';
    }

    /* Step 2 */
    if (
        (match = EXPRESSION_STEP_2.exec(value)) &&
        EXPRESSION_MEASURE_GREATER_THAN_0.test(match[1])
    ) {
        value = match[1] + step2list[match[2]];
    }

    /* Step 3 */
    if (
        (match = EXPRESSION_STEP_3.exec(value)) &&
        EXPRESSION_MEASURE_GREATER_THAN_0.test(match[1])
    ) {
        value = match[1] + step3list[match[2]];
    }

    /* Step 4 */
    if (match = EXPRESSION_STEP_4.exec(value)) {
        if (EXPRESSION_MEASURE_GREATER_THAN_1.test(match[1])) {
            value = match[1];
        }
    } else if (
        (match = EXPRESSION_SUFFIX_ION.exec(value)) &&
        EXPRESSION_MEASURE_GREATER_THAN_1.test(match[1])
    ) {
        value = match[1];
    }

    /* Step 5 */
    if (
        (match = EXPRESSION_SUFFIX_E.exec(value)) &&
        (
            EXPRESSION_MEASURE_GREATER_THAN_1.test(match[1]) ||
            (
                EXPRESSION_MEASURE_EQUAL_TO_1.test(match[1]) &&
                !EXPRESSION_CONSONANT_LIKE.test(match[1])
            )
        )
    ) {
        value = match[1];
    }

    if (
        EXPRESSION_SUFFIX_LL.test(value) &&
        EXPRESSION_MEASURE_GREATER_THAN_1.test(value)
    ) {
        value = value.slice(0, -1);
    }

    /* and turn initial Y back to y */
    if (firstCharacterWasLowerCaseY) {
        value = 'y' + value.substr(1);
    }

    return value;
}

module.exports = stemmer;

});

require.register("wooorm~retext-porter-stemmer@0.1.1", function (exports, module) {
'use strict';

var stemmer;

/**
 * Module dependencies.
 */

stemmer = require("wooorm~stemmer@0.1.1");

/**
 * Define `porterStemmer`;
 */

function porterStemmer() {}

/**
 * `changetextinside` handler;
 *
 * @this Node
 */

function onchangetextinside() {
    var value;

    value = this.toString();

    this.data.stem = value ? stemmer(value) : null;
}

/**
 * Define `attach`.
 *
 * @param {Retext} retext - Instance of Retext.
 */

function attach(retext) {
    var WordNode;

    WordNode = retext.parser.TextOM.WordNode;

    WordNode.on('changetextinside', onchangetextinside);
    WordNode.on('removeinside', onchangetextinside);
    WordNode.on('insertinside', onchangetextinside);
}

/**
 * Expose `attach`.
 */

porterStemmer.attach = attach;

/**
 * Expose `porterStemmer`.
 */

module.exports = porterStemmer;

});

require.register("retext-double-metaphone-gh-pages", function (exports, module) {
var retextDoubleMetaphone = require("wooorm~retext-double-metaphone@0.1.1"),
    porterStemmer = require("wooorm~retext-porter-stemmer@0.1.1"),
    visit = require("wooorm~retext-visit@0.1.1"),
    dom = require("wooorm~retext-dom@0.1.3"),
    Retext = require("wooorm~retext@0.2.0-rc.3"),
    retext = new Retext().use(visit).use(retextDoubleMetaphone).use(porterStemmer).use(dom),
    inputElement = document.getElementsByTagName('textarea')[0],
    outputElement = document.getElementsByTagName('div')[0],
    stemElement = document.getElementsByName('stem')[0],
    style = document.styleSheets[0],
    phonetics = {},
    shouldUseStemmedPhonetics, currentDOMTree, currentTree;

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

function getColourFromString(value) {
    value = intToARGB(hashCode(value)).slice(0, 6);

    while (value.length < 6) {
        value = '0' + value;
    }

    return '#' + value;
}

function addCSSRule(sheet, selector, rules) {
    if(sheet.insertRule) {
        sheet.insertRule(selector + '{' + rules + '}');
    } else {
        sheet.addRule(selector, rules);
    }
}

function onphonetics(phonetic) {
    var colour;

    if (phonetic in phonetics) {
        return;
    }

    colour = getColourFromString(phonetic)
    phonetics[phonetic] = colour;

    addCSSRule(style, '[data-phonetics="' + phonetic + '"]', 'color:' + colour);
    addCSSRule(style, '[data-secondary-phonetics="' + phonetic + '"]', 'border-bottom-color:' + colour);
}

function getPhonetics() {
    value = inputElement.value;

    retext.parse(value, function (err, tree) {
        if (err) throw err;

        if (currentDOMTree) {
            currentDOMTree.parentNode.removeChild(currentDOMTree);
        }

        currentTree = tree;
        
        currentTree.visit(function (node) {
            var phonetic;

            if (!node.DOMTagName || !node.data.phonetics) {
                return;
            }

            phonetic = node.data.phonetics;

            if (shouldUseStemmedPhonetics) {
                phonetic = node.data.stemmedPhonetics;
            }

            node.toDOMNode().setAttribute('title', '["' + phonetic[0] + '", "' + phonetic[1] + '"]');

            onphonetics(phonetic[0]);
            onphonetics(phonetic[1]);
            node.toDOMNode().setAttribute('data-phonetics', phonetic[0]);

            if (phonetic[0] !== phonetic[1]) {
                node.toDOMNode().setAttribute('data-secondary-phonetics', phonetic[1]);
            }
        });

        currentDOMTree = currentTree.toDOMNode();
        outputElement.appendChild(currentDOMTree);
    });
}

function onchange(event) {
    shouldUseStemmedPhonetics = event.target.checked;
    getPhonetics();
}

inputElement.addEventListener('input', getPhonetics);
stemElement.addEventListener('change', onchange);
onchange({'target' : stemElement});
getPhonetics();

});

require("retext-double-metaphone-gh-pages")
