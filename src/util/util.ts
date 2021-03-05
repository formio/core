import deepmerge from 'deepmerge';

/**
 * Get the keys of an Object.
 * @param obj
 */
export function keys(obj: any) {
    return Object.keys(obj);
};

/**
 * A no-operation function.
 */
export function noop() {
    return;
};

/**
 * Iterate through a collection or array.
 * @param collection
 * @param _each
 */
export function each(collection: any, _each: any) {
    const isArray = Array.isArray(collection);
    for (let i in collection) {
        if (collection.hasOwnProperty(i)) {
            if (_each(collection[i], isArray ? Number(i) : i) === true) {
                break;
            };
        }
    }
}

/**
 * Retrieve the path parts provided a path string.
 * @param path
 */
export function pathParts(path: string) {
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

/**
 * Get the value from an object or an array provided a path.
 *
 * @param obj
 * @param path
 * @param def
 */
export function get(obj: any, path: string, def?: any) {
    const val = pathParts(path).reduce((o: any, k: any) => (o || {})[k], obj);
    return (
        typeof def !== 'undefined' &&
        typeof val === 'undefined'
    ) ? def : val;
}

/**
 * Determine if a value is set.
 *
 * @param obj
 * @param path
 */
export function has(obj: any, path: string): boolean {
    return get(obj, path, undefined) !== undefined;
}

/**
 * Sets the value of an item within an array or object.
 * @param obj
 * @param path
 * @param value
 */
export function set(obj: any, path: string, value: any) {
    const parts = pathParts(path);
    parts.reduce((o: any, k: any, i: any) => {
        if (!Number.isNaN(Number(k))) {
            k = Number(k);
        }
        if (
            (Array.isArray(o) ? (k >= o.length) : !o.hasOwnProperty(k)) ||
            ((i < (parts.length - 1)) && !Array.isArray(o[k]) && !isObject(o[k]))
        ) {
            o[k] = !Number.isNaN(Number(parts[i + 1])) ? [] : {};
        }
        if (i === (parts.length - 1)) {
            o[k] = value;
        }
        return o[k];
    }, obj);
    return obj;
};

/**
 * Merges a complex data object.
 *
 * @param a
 * @param b
 * @param options
 */
export function merge(a: any, b: any, options?: any) {
    return deepmerge(a, b, options);
}

/**
 * Performs a fast clone deep operation.
 *
 * @param obj
 */
export function fastCloneDeep(obj: any) {
    try {
        return JSON.parse(JSON.stringify(obj));
    }
    catch (err) {
        console.log(`Clone Failed: ${err.message}`);
        return null;
    }
}

/**
 * Sets the defaults of an object.
 *
 * @param obj
 * @param defs
 */
export function defaults(obj: any, defs: any) {
    each(defs, (value: any, key: string) => {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = value;
        }
    });
    return obj;
}

/**
 * Checks if a value is a boolean.
 * @param value
 */
export function isBoolean(value: any) {
    return (typeof value === typeof true);
}

/**
 * Checks if a value is Nil.
 * @param value
 */
export function isNil(value: any) {
    return (value === null) || (value === undefined);
}

/**
 * Checks if an property is an object.
 * @param value
 */
export function isObject(value: any) {
    return value && (typeof value === 'object');
}

/**
 * Perform a find operation on each item in an array.
 * @param arr
 * @param query
 * @param fn
 */
export function findEach(arr: any, query: any, fn: any) {
    each(arr, (item: any, index: any) => {
        if (isEqual(pick(item, Object.keys(query)), query)) {
            if (fn(item, index) === true) {
                return true;
            }
        }
    });
}

/**
 * Perform a filter operation.
 * @param arr
 * @param fn
 */
export function filter(arr: any, fn?: any) {
    if (!arr) {
        return [];
    }
    if (!fn) {
        fn = (val: any) => !!val;
    }
    if (Array.isArray(arr) && typeof fn === 'function') {
        return arr.filter(fn);
    }
    let found: any = [];
    findEach(arr, fn, (item: any, index: any) => {
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

/**
 * Perform a find operation.
 * @param arr
 * @param query
 */
export function find(arr: any, query?: any) {
    if (!arr) {
        return undefined;
    }
    if (Array.isArray(arr) && typeof query === 'function') {
        return arr.find(query);
    }
    let found = undefined;
    findEach(arr, query, (item: any) => {
        found = item;
        return true;
    });
    return found;
}

/**
 * Determines equality of a value or complex object.
 * @param a
 * @param b
 */
export function isEqual(a: any, b: any) {
    let equal = true;
    if (a === b) {
        return equal;
    }
    if (a && b && (Array.isArray(a) || isObject(a))) {
        each(a, (val: any, key: any) => {
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

/**
 * Pick an item in an object.
 * @param object
 * @param keys
 */
export function pick(object: any, keys?: any) {
    return keys.reduce((obj: any, key: string) => {
        if (object && object.hasOwnProperty(key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});
};

/**
 * Get the intersection of two objects.
 * @param a
 * @param b
 */
export function intersection(a: any, b: any) {
    return a.filter((value: any) => b.includes(value));
}

// From https://youmightnotneed.com/lodash/#trim
export function trim(str: string, c: string = '\\s') {
    return str.replace(new RegExp(`^([${c}]*)(.*?)([${c}]*)$`), '$2')
}

/**
 * Get the last item in an array.
 * @param arr
 */
export function last(arr: Array<any>) {
    return arr[arr.length - 1];
}

export * from './formUtil';