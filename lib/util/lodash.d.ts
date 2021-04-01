export declare function isString(val: any): boolean;
export declare function isEmpty(obj: any): boolean;
export declare function isInteger(val: any): boolean;
export declare function isNaN(val: any): boolean;
export declare function isNil(val: any): boolean;
export declare function isNull(val: any): boolean;
export declare function isArray(val: any): boolean;
export declare function isObjectLike(val: any): boolean;
export declare function isObject(val: any): boolean;
export declare function isPlainObject(value: any): boolean;
export declare function isNumber(value: any): boolean;
export declare function isBoolean(value: any): boolean;
export declare function isRegExp(value: any): boolean;
/**
 * Get the keys of an Object.
 * @param obj
 */
export declare function keys(obj: any): string[];
/**
 * Return the values of an object or an array.
 * @param obj
 * @returns
 */
export declare function values(obj: any): any;
/**
 * A no-operation function.
 */
export declare function noop(): void;
/**
 * Iterate through a collection or array.
 * @param collection
 * @param _each
 */
export declare function each(collection: any, _each: any): void;
/**
 * Retrieve the path parts provided a path string.
 * @param path
 */
export declare function pathParts(path: string): string[];
/**
 * Get the value from an object or an array provided a path.
 *
 * @param obj
 * @param path
 * @param def
 */
export declare function get(obj: any, path: string, def?: any): any;
export declare function property(path: string): (obj: any) => any;
export declare function propertyOf(obj: any): (path: string) => any;
/**
 * Determine if a value is set.
 *
 * @param obj
 * @param path
 */
export declare function has(obj: any, path: string): boolean;
/**
 * Sets the value of an item within an array or object.
 * @param obj
 * @param path
 * @param value
 */
export declare function set(obj: any, path: string, value: any): any;
/**
 * Merges a complex data object.
 *
 * @param a
 * @param b
 * @param options
 */
export declare function merge(...args: any): object;
/**
 * Performs a fast clone deep operation.
 *
 * @param obj
 */
export declare function fastCloneDeep(obj: any): any;
/**
 * Performs a recursive cloneDeep operation.
 * @param src
 * @returns
 */
export declare function cloneDeep(src: any): any;
/**
 * Sets the defaults of an object.
 *
 * @param obj
 * @param defs
 */
export declare function defaults(obj: any, defs: any): any;
/**
 * Returns a function to perform matches.
 * @param query
 * @returns
 */
export declare function matches(query: any): (comp: any) => boolean;
/**
 * Perform a find operation on each item in an array.
 * @param arr
 * @param query
 * @param fn
 */
export declare function findEach(arr: any, query: any, fn: any): void;
/**
 * Perform a filter operation.
 * @param arr
 * @param fn
 */
export declare function filter(arr: any, fn?: any): any;
/**
 * Perform a find operation.
 * @param arr
 * @param query
 */
export declare function find(arr: any, query?: any, findIndex?: boolean): any;
/**
 * Find an index.
 *
 * @param arr
 * @param query
 * @returns
 */
export declare function findIndex(arr: any, query?: any): any;
/**
 * Determines equality of a value or complex object.
 * @param a
 * @param b
 */
export declare function isEqual(a: any, b: any): boolean;
/**
 * Pick an item in an object.
 * @param object
 * @param keys
 */
export declare function pick(object: any, keys?: any): any;
/**
 * Get the intersection of two objects.
 * @param a
 * @param b
 */
export declare function intersection(a: any, b: any): any;
export declare function trim(str: string, c?: string): string;
/**
 * Get the last item in an array.
 * @param arr
 */
export declare function last(arr: Array<any>): any;
/**
 * Debounc the call of a function for a given amount of time.
 *
 * @param func
 * @param wait
 * @returns
 */
export declare function debounce(func: any, wait?: number): (...args: any) => void;
export declare function chunk(input: any, size: any): any;
export declare function compact(input: any): any;
export declare function concat(input: any, ...args: any): any;
export declare function difference(...arrays: any): any;
export declare function drop(arr: any, index: any): any;
export declare function dropRight(arr: any, index: any): any;
export declare function add(a: number, b: number): number;
export declare function subtract(a: number, b: number): number;
export declare function multiply(a: number, b: number): number;
export declare function divide(a: number, b: number): number;
export declare function mod(a: number, b: number): number;
export declare function sum(arr: any): any;
export declare function ceil(a: number, precision?: number): any;
export declare function floor(a: number, precision?: number): any;
export declare function round(a: number, precision?: number): any;
export declare function max(arr: any): number;
export declare function maxBy(arr: any, fn: any): any;
export declare function min(arr: any): number;
export declare function minBy(arr: any, fn: any): any;
export declare function sumBy(arr: any, fn: any): any;
export declare function mean(arr: any): number;
export declare function meanBy(arr: any, fn: any): number;
