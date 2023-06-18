import _ from 'lodash';

import { FieldError } from 'error';
import { TextFieldComponent, RuleFn } from 'types';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('maxLength');
};

export const validateMaximumLength: RuleFn = async (context) => {
    const { component, data, path } = context;
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const maxLength =
        typeof component.validate?.maxLength === 'string'
            ? parseInt(component.validate.maxLength, 10)
            : component.validate?.maxLength;
    const value = _.get(data, path);
    if (value && maxLength && typeof value === 'string') {
        if (value.length > maxLength) {
            const error = new FieldError('maxLength', { ...context, length: String(maxLength) });
            return error;
        }
    }
    return null;
};
