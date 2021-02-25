"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.set = exports.get = exports.each = exports.noop = exports.keys = void 0;
var deepmerge_1 = __importDefault(require("deepmerge"));
function keys(obj) {
    return Object.keys(obj);
}
exports.keys = keys;
;
function noop() {
    return;
}
exports.noop = noop;
;
function each(collection, _each) {
    var isArray = Array.isArray(collection);
    for (var i in collection) {
        if (collection.hasOwnProperty(i)) {
            if (_each(collection[i], isArray ? Number(i) : i) === true) {
                break;
            }
            ;
        }
    }
}
exports.each = each;
function get(obj, path, def) {
    var val = path.
        replace(/\[/g, '.').
        replace(/\]/g, '').
        split('.').
        reduce(function (o, k) { return (o || {})[k]; }, obj);
    return (typeof def !== 'undefined' &&
        typeof val === 'undefined') ? def : val;
}
exports.get = get;
function set(obj, path, value) {
    var parts = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    parts.reduce(function (o, k, i) {
        if (!Number.isNaN(Number(k))) {
            k = Number(k);
        }
        if (Array.isArray(o) ? (k >= o.length) : !o.hasOwnProperty(k)) {
            o[k] = !Number.isNaN(Number(parts[i + 1])) ? [] : {};
        }
        if (i === (parts.length - 1)) {
            o[k] = value;
        }
        return o[k];
    }, obj);
    return obj;
}
exports.set = set;
;
function merge(a, b, options) {
    return deepmerge_1.default(a, b, options);
}
exports.merge = merge;
