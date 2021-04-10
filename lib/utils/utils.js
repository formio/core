"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegExCharacters = void 0;
/**
 * Escapes RegEx characters in provided String value.
 *
 * @param {String} value
 *   String for escaping RegEx characters.
 * @returns {string}
 *   String with escaped RegEx characters.
 */
function escapeRegExCharacters(value) {
    return value.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}
exports.escapeRegExCharacters = escapeRegExCharacters;
