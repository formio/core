"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.last = exports.trim = exports.intersection = exports.isObject = exports.isNil = exports.isBoolean = exports.defaults = exports.fastCloneDeep = exports.merge = exports.set = exports.get = exports.each = exports.noop = exports.keys = void 0;
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
function fastCloneDeep(obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    }
    catch (err) {
        console.log("Clone Failed: " + err.message);
        return null;
    }
}
exports.fastCloneDeep = fastCloneDeep;
function defaults(obj, defs) {
    each(defs, function (value, key) {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = value;
        }
    });
    return obj;
}
exports.defaults = defaults;
function isBoolean(value) {
    return (typeof value === typeof true);
}
exports.isBoolean = isBoolean;
function isNil(value) {
    return (value === null) || (value === undefined);
}
exports.isNil = isNil;
function isObject(value) {
    return value && (typeof value === 'object');
}
exports.isObject = isObject;
function intersection(a, b) {
    return a.filter(function (value) { return b.includes(value); });
}
exports.intersection = intersection;
// From https://youmightnotneed.com/lodash/#trim
function trim(str, c) {
    if (c === void 0) { c = '\\s'; }
    return str.replace(new RegExp("^([" + c + "]*)(.*?)([" + c + "]*)$"), '$2');
}
exports.trim = trim;
function last(arr) {
    return arr[arr.length - 1];
}
exports.last = last;
__exportStar(require("./formUtil"), exports);
