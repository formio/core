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