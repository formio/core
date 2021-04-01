"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sum = exports.mod = exports.divide = exports.multiply = exports.subtract = exports.add = exports.dropRight = exports.drop = exports.difference = exports.concat = exports.compact = exports.chunk = exports.debounce = exports.last = exports.trim = exports.intersection = exports.pick = exports.isEqual = exports.findIndex = exports.find = exports.filter = exports.findEach = exports.matches = exports.defaults = exports.cloneDeep = exports.fastCloneDeep = exports.merge = exports.set = exports.has = exports.propertyOf = exports.property = exports.get = exports.pathParts = exports.each = exports.noop = exports.values = exports.keys = exports.isRegExp = exports.isBoolean = exports.isNumber = exports.isPlainObject = exports.isObject = exports.isObjectLike = exports.isArray = exports.isNull = exports.isNil = exports.isNaN = exports.isInteger = exports.isEmpty = exports.isString = void 0;
exports.meanBy = exports.mean = exports.sumBy = exports.minBy = exports.min = exports.maxBy = exports.max = exports.round = exports.floor = exports.ceil = void 0;
var deepmerge_1 = __importDefault(require("deepmerge"));
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag(value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
    }
    return Object.prototype.toString.call(value);
}
function isString(val) {
    return typeof val === 'string';
}
exports.isString = isString;
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_isempty
function isEmpty(obj) {
    return [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
}
exports.isEmpty = isEmpty;
function isInteger(val) {
    return Number.isInteger(val);
}
exports.isInteger = isInteger;
function isNaN(val) {
    return Number.isNaN(val);
}
exports.isNaN = isNaN;
function isNil(val) {
    return val == null;
}
exports.isNil = isNil;
function isNull(val) {
    return val === null;
}
exports.isNull = isNull;
function isArray(val) {
    return Array.isArray(val);
}
exports.isArray = isArray;
function isObjectLike(val) {
    return (typeof val === "object" || typeof val === 'function') && (val !== null);
}
exports.isObjectLike = isObjectLike;
function isObject(val) {
    return isObjectLike(val) || (typeof val === 'function');
}
exports.isObject = isObject;
function isPlainObject(value) {
    if (!isObjectLike(value) || getTag(value) != '[object Object]') {
        return false;
    }
    if (Object.getPrototypeOf(value) === null) {
        return true;
    }
    var proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
}
exports.isPlainObject = isPlainObject;
function isNumber(value) {
    return typeof value === 'number' || (isObjectLike(value) && getTag(value) == '[object Number]');
}
exports.isNumber = isNumber;
function isBoolean(value) {
    return value === true || value === false || (isObjectLike(value) && getTag(value) == '[object Boolean]');
}
exports.isBoolean = isBoolean;
function isRegExp(value) {
    return isObjectLike(value) && getTag(value) == '[object RegExp]';
}
exports.isRegExp = isRegExp;
/**
 * Get the keys of an Object.
 * @param obj
 */
function keys(obj) {
    return Object.keys(obj);
}
exports.keys = keys;
;
/**
 * Return the values of an object or an array.
 * @param obj
 * @returns
 */
function values(obj) {
    return isArray(obj) ? obj : Object.values(obj);
}
exports.values = values;
/**
 * A no-operation function.
 */
function noop() {
    return;
}
exports.noop = noop;
;
/**
 * Iterate through a collection or array.
 * @param collection
 * @param _each
 */
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
/**
 * Retrieve the path parts provided a path string.
 * @param path
 */
function pathParts(path) {
    if (!path) {
        return [];
    }
    if (path[0] === '[') {
        path = path.replace(/^\[([^\]]+)\]/, '$1');
    }
    return path.
        replace(/\[/g, '.').
        replace(/\]/g, '').
        split('.');
}
exports.pathParts = pathParts;
/**
 * Get the value from an object or an array provided a path.
 *
 * @param obj
 * @param path
 * @param def
 */
function get(obj, path, def) {
    var val = pathParts(path).reduce(function (o, k) { return (o || {})[k]; }, obj);
    return (typeof def !== 'undefined' &&
        typeof val === 'undefined') ? def : val;
}
exports.get = get;
function property(path) {
    return function (obj) { return get(obj, path); };
}
exports.property = property;
function propertyOf(obj) {
    return function (path) { return get(obj, path); };
}
exports.propertyOf = propertyOf;
/**
 * Determine if a value is set.
 *
 * @param obj
 * @param path
 */
function has(obj, path) {
    return get(obj, path, undefined) !== undefined;
}
exports.has = has;
/**
 * Sets the value of an item within an array or object.
 * @param obj
 * @param path
 * @param value
 */
function set(obj, path, value) {
    var parts = pathParts(path);
    parts.reduce(function (o, k, i) {
        if (!isNaN(Number(k))) {
            k = Number(k);
        }
        if ((Array.isArray(o) ? (k >= o.length) : !o.hasOwnProperty(k)) ||
            ((i < (parts.length - 1)) && !Array.isArray(o[k]) && !isObject(o[k]))) {
            o[k] = !isNaN(Number(parts[i + 1])) ? [] : {};
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
/**
 * Merges a complex data object.
 *
 * @param a
 * @param b
 * @param options
 */
function merge() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return deepmerge_1.default.all(args.map(function (obj) { return (obj || {}); }));
}
exports.merge = merge;
/**
 * Performs a fast clone deep operation.
 *
 * @param obj
 */
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
/**
 * Performs a recursive cloneDeep operation.
 * @param src
 * @returns
 */
function cloneDeep(src) {
    if (Array.isArray(src)) { // for arrays
        return src.map(cloneDeep);
    }
    if (src === null || typeof src !== 'object') { // for primitives / functions / non-references/pointers
        return src;
    }
    return Object.fromEntries(Object.entries(src).map(function (_a) {
        var key = _a[0], val = _a[1];
        return ([key, cloneDeep(val)]);
    }));
}
exports.cloneDeep = cloneDeep;
/**
 * Sets the defaults of an object.
 *
 * @param obj
 * @param defs
 */
function defaults(obj, defs) {
    each(defs, function (value, key) {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = value;
        }
    });
    return obj;
}
exports.defaults = defaults;
/**
 * Returns a function to perform matches.
 * @param query
 * @returns
 */
function matches(query) {
    return function (comp) {
        return isEqual(pick(comp, Object.keys(query)), query);
    };
}
exports.matches = matches;
/**
 * Perform a find operation on each item in an array.
 * @param arr
 * @param query
 * @param fn
 */
function findEach(arr, query, fn) {
    each(arr, function (item, index) {
        if (matches(query)(item)) {
            if (fn(item, index) === true) {
                return true;
            }
        }
    });
}
exports.findEach = findEach;
/**
 * Perform a filter operation.
 * @param arr
 * @param fn
 */
function filter(arr, fn) {
    if (!arr) {
        return [];
    }
    if (!fn) {
        fn = function (val) { return !!val; };
    }
    if (Array.isArray(arr) && typeof fn === 'function') {
        return arr.filter(fn);
    }
    var found = [];
    findEach(arr, fn, function (item, index) {
        found.push(item);
        if (Array.isArray(item)) {
            arr.splice(index, 1);
        }
        else {
            delete arr[index];
        }
    });
    return found;
}
exports.filter = filter;
/**
 * Perform a find operation.
 * @param arr
 * @param query
 */
function find(arr, query, findIndex) {
    if (findIndex === void 0) { findIndex = false; }
    if (!arr) {
        return undefined;
    }
    if (Array.isArray(arr) && typeof query === 'function') {
        return findIndex ? arr.findIndex(query) : arr.find(query);
    }
    var found = undefined;
    var foundIndex = 0;
    findEach(arr, query, function (item, index) {
        found = item;
        foundIndex = index;
        return true;
    });
    return findIndex ? foundIndex : found;
}
exports.find = find;
/**
 * Find an index.
 *
 * @param arr
 * @param query
 * @returns
 */
function findIndex(arr, query) {
    return find(arr, query, true);
}
exports.findIndex = findIndex;
/**
 * Determines equality of a value or complex object.
 * @param a
 * @param b
 */
function isEqual(a, b) {
    var equal = false;
    if (a === b) {
        return true;
    }
    if (a && b && (Array.isArray(a) || isObject(a))) {
        equal = true;
        each(a, function (val, key) {
            if ((Array.isArray(val) || isObject(val)) && !isEqual(b[key], val)) {
                equal = false;
                return true;
            }
            if (b[key] !== val) {
                equal = false;
                return true;
            }
        });
    }
    return equal;
}
exports.isEqual = isEqual;
/**
 * Pick an item in an object.
 * @param object
 * @param keys
 */
function pick(object, keys) {
    return keys.reduce(function (obj, key) {
        if (object && object.hasOwnProperty(key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});
}
exports.pick = pick;
;
/**
 * Get the intersection of two objects.
 * @param a
 * @param b
 */
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
/**
 * Get the last item in an array.
 * @param arr
 */
function last(arr) {
    return arr[arr.length - 1];
}
exports.last = last;
/**
 * Debounc the call of a function for a given amount of time.
 *
 * @param func
 * @param wait
 * @returns
 */
function debounce(func, wait) {
    if (wait === void 0) { wait = 100; }
    var timeout;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            timeout = null;
            func.apply(void 0, args);
        }, wait);
    };
}
exports.debounce = debounce;
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_chunk
function chunk(input, size) {
    return input.reduce(function (arr, item, idx) {
        return idx % size === 0
            ? __spreadArray(__spreadArray([], arr), [[item]]) : __spreadArray(__spreadArray([], arr.slice(0, -1)), [__spreadArray(__spreadArray([], arr.slice(-1)[0]), [item])]);
    }, []);
}
exports.chunk = chunk;
;
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_compact
function compact(input) {
    return input.filter(Boolean);
}
exports.compact = compact;
function concat(input) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return input.concat.apply(input, args);
}
exports.concat = concat;
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_difference
function difference() {
    var arrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
    }
    return arrays.reduce(function (a, b) {
        return a.filter(function (value) {
            return !b.includes(value);
        });
    });
}
exports.difference = difference;
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_drop
function drop(arr, index) {
    return arr.slice(index);
}
exports.drop = drop;
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_dropright
function dropRight(arr, index) {
    return arr.slice(0, -index);
}
exports.dropRight = dropRight;
function add(a, b) {
    return a + b;
}
exports.add = add;
function subtract(a, b) {
    return a - b;
}
exports.subtract = subtract;
function multiply(a, b) {
    return a * b;
}
exports.multiply = multiply;
function divide(a, b) {
    return a / b;
}
exports.divide = divide;
function mod(a, b) {
    return a % b;
}
exports.mod = mod;
function sum(arr) {
    return arr.reduce(add, 0);
}
exports.sum = sum;
function mathOp(a, op, precision) {
    if (precision === void 0) { precision = 0; }
    if (!precision) {
        return op(a);
    }
    precision = Math.pow(10, precision);
    return op(a * precision) / precision;
}
function ceil(a, precision) {
    if (precision === void 0) { precision = 0; }
    return mathOp(a, Math.ceil, precision);
}
exports.ceil = ceil;
function floor(a, precision) {
    if (precision === void 0) { precision = 0; }
    return mathOp(a, Math.floor, precision);
}
exports.floor = floor;
function round(a, precision) {
    if (precision === void 0) { precision = 0; }
    return mathOp(a, Math.round, precision);
}
exports.round = round;
function max(arr) {
    return Math.max.apply(Math, arr);
}
exports.max = max;
function getBy(arr, fn, op) {
    var first = arr.shift();
    var fnString = isString(fn);
    return arr.reduce(function (current, item) { return op(current, fnString ? get(item, fn) : fn(item)); }, first);
}
function maxBy(arr, fn) {
    return getBy(arr, fn, Math.max);
}
exports.maxBy = maxBy;
function min(arr) {
    return Math.min.apply(Math, arr);
}
exports.min = min;
function minBy(arr, fn) {
    return getBy(arr, fn, Math.min);
}
exports.minBy = minBy;
function sumBy(arr, fn) {
    return getBy(arr, fn, function (a, b) { return (a + b); });
}
exports.sumBy = sumBy;
function mean(arr) {
    return sum(arr) / arr.length;
}
exports.mean = mean;
function meanBy(arr, fn) {
    return sumBy(arr, fn) / arr.length;
}
exports.meanBy = meanBy;
