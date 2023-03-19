"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boolValue = exports.escapeRegExCharacters = void 0;
const _ = __importStar(require("@formio/lodash"));
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
/**
 * Determines the boolean value of a setting.
 *
 * @param value
 * @return {boolean}
 */
function boolValue(value) {
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
exports.boolValue = boolValue;
