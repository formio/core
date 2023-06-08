import { ValidatorError } from '../error/ValidatorError';
import { Component } from '../types';

export function isComponentPersistent(component: Component) {
    return component.persistent ? component.persistent : true;
}

export function isComponentProtected(component: Component) {
    return component.protected ? component.protected : false;
}

export function shouldSkipValidation(component: Component) {
    return !isComponentPersistent(component) || isComponentProtected(component);
}

export function getErrorMessage(
    component: Component,
    message: string,
    messageOnly: boolean = false
) {
    if (component.errorLabel) {
        return `${component.errorLabel} ${message}`;
    } else if (messageOnly) {
        return message;
    } else {
        return `${component.label ?? component.key} ${message}`;
    }
}

export function isEmptyObject(obj: any): obj is {} {
    return !!obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function toBoolean(value: any) {
    switch (typeof value) {
        case 'string':
            if (value === 'true' || value === '1') {
                return true;
            } else if (value === 'false' || value === '0') {
                return false;
            } else {
                throw new ValidatorError(`Cannot coerce string ${value} to boolean}`);
            }
        case 'boolean':
            return value;
        default:
            return !!value;
    }
}

export function isPromise(value: any): value is Promise<any> {
    return (
        value &&
        value.then &&
        typeof value.then === 'function' &&
        Object.prototype.toString.call(value) === '[object Promise]'
    );
}

export function isObject(obj: any): obj is Object {
    return typeof obj != null && (typeof obj === 'object' || typeof obj === 'function');
}
