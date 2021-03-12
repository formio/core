"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = exports.last = exports.trim = exports.intersection = exports.pick = exports.isEqual = exports.find = exports.filter = exports.findEach = exports.isObject = exports.isNil = exports.isBoolean = exports.defaults = exports.fastCloneDeep = exports.merge = exports.set = exports.has = exports.get = exports.pathParts = exports.each = exports.noop = exports.keys = void 0;
var deepmerge_1 = __importDefault(require("deepmerge"));
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
        if (!Number.isNaN(Number(k))) {
            k = Number(k);
        }
        if ((Array.isArray(o) ? (k >= o.length) : !o.hasOwnProperty(k)) ||
            ((i < (parts.length - 1)) && !Array.isArray(o[k]) && !isObject(o[k]))) {
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
 * Checks if a value is a boolean.
 * @param value
 */
function isBoolean(value) {
    return (typeof value === typeof true);
}
exports.isBoolean = isBoolean;
/**
 * Checks if a value is Nil.
 * @param value
 */
function isNil(value) {
    return (value === null) || (value === undefined);
}
exports.isNil = isNil;
/**
 * Checks if an property is an object.
 * @param value
 */
function isObject(value) {
    return value && (typeof value === 'object');
}
exports.isObject = isObject;
/**
 * Perform a find operation on each item in an array.
 * @param arr
 * @param query
 * @param fn
 */
function findEach(arr, query, fn) {
    each(arr, function (item, index) {
        if (isEqual(pick(item, Object.keys(query)), query)) {
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
function find(arr, query) {
    if (!arr) {
        return undefined;
    }
    if (Array.isArray(arr) && typeof query === 'function') {
        return arr.find(query);
    }
    var found = undefined;
    findEach(arr, query, function (item) {
        found = item;
        return true;
    });
    return found;
}
exports.find = find;
/**
 * Determines equality of a value or complex object.
 * @param a
 * @param b
 */
function isEqual(a, b) {
    var equal = true;
    if (a === b) {
        return equal;
    }
    if (a && b && (Array.isArray(a) || isObject(a))) {
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
