import { isRegExp } from 'lodash';

/**
 * Returns an input mask that is compatible with the input mask library.
 * @param {string} mask - The Form.io input mask.
 * @param {string} placeholderChar - Char which is used as a placeholder.
 * @returns {Array} - The input mask for the mask library.
 */
export function getInputMask(mask: any, placeholderChar?: any) {
  if (mask instanceof Array) {
    return mask;
  }
  const maskArray: any = [];
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

export function matchInputMask(value: any, inputMask: any) {
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

    if (!((isRegExp(charPart) && charPart.test(char)) || charPart === char)) {
      return false;
    }
  }

  return true;
}
