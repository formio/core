import _ from 'lodash';

import { Component, DataObject, Form, ProcessorContext, ValidationContext } from 'types';
import { Evaluator, Utils } from 'utils';

export function isComponentPersistent(component: Component) {
    return component.persistent ? component.persistent : true;
}

export function isComponentProtected(component: Component) {
    return component.protected ? component.protected : false;
}

export function shouldSkipValidation(component: Component, value: unknown) {
    if (component.validate?.custom && (_.isEmpty(value)) && !component.validate?.required) {
        return true;
    }
    if (!component.input) {
        return true;
    }
    // TODO: is this correct? we don't want the client skipping validation on, say, a password but we may want the server to
    if (typeof window === 'undefined' && component.protected) {
        return true;
    }
    if (component.persistent === false || (component.persistent === 'client-only')) {
        return true;
    }
    return false;
}

export function isEmptyObject(obj: any): obj is {} {
    return !!obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function getComponentErrorField(component: Component, context: ValidationContext) {
    const toInterpolate = component.errorLabel || component.label || component.placeholder || component.key;
    return Evaluator.interpolate(toInterpolate, context);
}

export function toBoolean(value: any) {
    switch (typeof value) {
        case 'string':
            if (value === 'true' || value === '1') {
                return true;
            } else if (value === 'false' || value === '0') {
                return false;
            } else {
                throw `Cannot coerce string ${value} to boolean}`;
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

export function getEmptyValue(component: Component) {
    switch (component.type) {
        case 'textarea':
        case 'textfield':
        case 'time':
        case 'datetime':
        case 'day':
            return '';
        case 'datagrid':
        case 'editgrid':
            return [];

        default:
            return null;
    }
}

export function isEmpty(component: Component, value: unknown) {
    const isEmptyArray = (_.isArray(value) && value.length === 1) ? _.isEqual(value[0], getEmptyValue(component)) : false;
    return value == null || (_.isArray(value) && value.length === 0) || isEmptyArray;
}
