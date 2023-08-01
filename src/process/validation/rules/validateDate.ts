import _ from 'lodash';

import { FieldError } from 'error';
import { DateTimeComponent, TextFieldComponent, RuleFn, RuleFnSync } from 'types';

const isValidatableDateTimeComponent = (obj: any): obj is DateTimeComponent => {
    return !!obj && !!obj.type && obj.type === 'datetime';
};

const isValidatableTextFieldComponent = (obj: any): obj is TextFieldComponent => {
    return !!obj && !!obj.type && obj.widget && obj.widget.type === 'calendar';
};

const isValidatable = (component: any) => {
    return isValidatableDateTimeComponent(component) || isValidatableTextFieldComponent(component);
};

export const validateDate: RuleFn = async (context) => {
    return validateDateSync(context);
};

export const validateDateSync: RuleFnSync = (context) => {
    const error = new FieldError('invalidDate', context);
    const { component, value} = context;
    if (!value || !isValidatable(component)) {
        return null;
    }

    // TODO: is this right?
    if (typeof value === 'string') {
        if (value.toLowerCase() === 'invalid date') {
            return error;
        }
        if (new Date(value).toString() === 'Invalid Date') {
            return error;
        }
        return null;
    } else if (value instanceof Date) {
        return value.toString() !== 'Invalid Date' ? null : error;
    }
    return error;
};
