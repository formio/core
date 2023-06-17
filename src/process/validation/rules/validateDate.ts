import _ from 'lodash';

import { FieldError } from 'error';
import { DateTimeComponent, TextFieldComponent, RuleFn } from 'types';

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
    const error = new FieldError('invalidDate', context);
    const { component, data, path} = context;
    let value = _.get(data, path);
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
