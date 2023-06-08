import * as _ from '@formio/lodash';

/**
 * Escapes RegEx characters in provided String value.
 *
 * @param {String} value
 *   String for escaping RegEx characters.
 * @returns {string}
 *   String with escaped RegEx characters.
 */
export function escapeRegExCharacters(value: string) {
  return value.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

/**
 * Determines the boolean value of a setting.
 *
 * @param value
 * @return {boolean}
 */
 export function boolValue(value: any) {
  if (_.isBoolean(value)) {
    return value;
  }
  else if (_.isString(value)) {
    return (value.toLowerCase() === 'true');
  }
  else {
    return !!value;
  }
}
