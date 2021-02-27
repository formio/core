import deepmerge from 'deepmerge';
export function keys(obj: any) {
    return Object.keys(obj);
};

export function noop() {
    return;
};

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

export function get(obj: any, path: string, def?: any) {
    const val = path.
    replace(/\[/g, '.').
    replace(/\]/g, '').
    split('.').
    reduce((o: any, k: any) => (o || {})[k], obj);
    return (
        typeof def !== 'undefined' &&
        typeof val === 'undefined'
    ) ? def : val;
}

export function set(obj: any, path: string, value: any) {
    const parts = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    parts.reduce((o: any, k: any, i: any) => {
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
};

export function merge(a: any, b: any, options?: any) {
    return deepmerge(a, b, options);
}

export function fastCloneDeep(obj: any) {
    try {
        return JSON.parse(JSON.stringify(obj));
    }
    catch (err) {
        console.log(`Clone Failed: ${err.message}`);
        return null;
    }
}

export function defaults(obj: any, defs: any) {
    each(defs, (value: any, key: string) => {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = value;
        }
    });
    return obj;
}

export function isBoolean(value: any) {
    return (typeof value === typeof true);
}

export function isNil(value: any) {
    return (value === null) || (value === undefined);
}

export function isObject(value: any) {
    return value && (typeof value === 'object');
}

export function intersection(a: any, b: any) {
    return a.filter((value: any) => b.includes(value));
}

// From https://youmightnotneed.com/lodash/#trim
export function trim(str: string, c: string = '\\s') {
    return str.replace(new RegExp(`^([${c}]*)(.*?)([${c}]*)$`), '$2')
}

export function last(arr: Array<any>) {
    return arr[arr.length - 1];
}

export * from './formUtil';