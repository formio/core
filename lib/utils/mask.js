"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchInputMask = exports.getInputMask = void 0;
const lodash_1 = require("@formio/lodash");
/**
 * Returns an input mask that is compatible with the input mask library.
 * @param {string} mask - The Form.io input mask.
 * @param {string} placeholderChar - Char which is used as a placeholder.
 * @returns {Array} - The input mask for the mask library.
 */
function getInputMask(mask, placeholderChar) {
    if (mask instanceof Array) {
        return mask;
    }
    const maskArray = [];
    maskArray.numeric = true;
    for (let i = 0; i < mask.length; i++) {
        switch (mask[i]) {
            case '9':
                maskArray.push(/\d/);
                break;
            case 'A':
                maskArray.numeric = false;
                maskArray.push(/[a-zA-Z]/);
                break;
            case 'a':
                maskArray.numeric = false;
                maskArray.push(/[a-z]/);
                break;
            case '*':
                maskArray.numeric = false;
                maskArray.push(/[a-zA-Z0-9]/);
                break;
            // If char which is used inside mask placeholder was used in the mask, replace it with space to prevent errors
            case placeholderChar:
                maskArray.numeric = false;
                maskArray.push(' ');
                break;
            default:
                maskArray.numeric = false;
                maskArray.push(mask[i]);
                break;
        }
    }
    return maskArray;
}
exports.getInputMask = getInputMask;
function matchInputMask(value, inputMask) {
    if (!inputMask) {
        return true;
    }
    // If value is longer than mask, it isn't valid.
    if (value.length > inputMask.length) {
        return false;
    }
    for (let i = 0; i < inputMask.length; i++) {
        const char = value[i];
        const charPart = inputMask[i];
        if (!((0, lodash_1.isRegExp)(charPart) && charPart.test(char) || charPart === char)) {
            return false;
        }
    }
    return true;
}
exports.matchInputMask = matchInputMask;
