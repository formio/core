/**
 * Get the keys of an Object.
 * @param obj
 */
export declare function keys(obj: any): string[];
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
 * Sets the defaults of an object.
 *
 * @param obj
 * @param defs
 */
export declare function defaults(obj: any, defs: any): any;
/**
 * Checks if a value is a boolean.
 * @param value
 */
export declare function isBoolean(value: any): boolean;
/**
 * Checks if a value is Nil.
 * @param value
 */
export declare function isNil(value: any): boolean;
/**
 * Checks if an property is an object.
 * @param value
 */
export declare function isObject(value: any): any;
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
export declare function find(arr: any, query?: any): any;
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
