/**
 * Returns an input mask that is compatible with the input mask library.
 * @param {string} mask - The Form.io input mask.
 * @param {string} placeholderChar - Char which is used as a placeholder.
 * @returns {Array} - The input mask for the mask library.
 */
export declare function getInputMask(mask: any, placeholderChar?: any): any;
export declare function matchInputMask(value: any, inputMask: any): boolean;
