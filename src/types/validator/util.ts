import moment from 'moment';

import { ValidatorError } from '../error/ValidatorError';
import { Component } from '../types';
import { DayComponent } from '../types/Component';
import { Evaluator } from '../evaluator/Evaluator';

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

export const getDateValidationFormat = (component: DayComponent) => {
    return component.dayFirst ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
};

export const isPartialDay = (component: DayComponent, value: string | undefined) => {
    if (!value) {
        return false;
    }
    const [DAY, MONTH, YEAR] = component.dayFirst ? [0, 1, 2] : [1, 0, 2];
    const values = value.split('/');
    return values[DAY] === '00' || values[MONTH] === '00' || values[YEAR] === '0000';
};

export function getDateSetting(date: unknown) {
    if (date === null || date === undefined || Number.isNaN(date) || date === '') {
        return null;
    }

    if (date instanceof Date) {
        return date;
    } else if (moment.isMoment(date)) {
        return date.isValid() ? date.toDate() : null;
    }

    let dateSetting =
        typeof date !== 'string' || date.indexOf('moment(') === -1 ? moment(date) : null;
    if (dateSetting && dateSetting.isValid()) {
        return dateSetting.toDate();
    }

    dateSetting = null;
    try {
        const value = Evaluator.evaluator(`return ${date};`, false, 'moment')(moment);
        if (typeof value === 'string') {
            dateSetting = moment(value);
        } else if (typeof value.toDate === 'function') {
            dateSetting = moment(value.toDate().toUTCString());
        } else if (value instanceof Date) {
            dateSetting = moment(value);
        }
    } catch (e) {
        return null;
    }

    if (!dateSetting) {
        return null;
    }

    // Ensure this is a date.
    if (!dateSetting.isValid()) {
        return null;
    }

    return dateSetting.toDate();
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
