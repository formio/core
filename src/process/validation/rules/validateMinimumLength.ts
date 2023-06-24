import _ from 'lodash';

import { FieldError } from 'error';
import { RuleFn, TextFieldComponent } from 'types';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('minLength');
};

export const validateMinimumLength: RuleFn = async (context) => {
    const { component, value } = context;
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const minLength =
        typeof component.validate?.minLength === 'string'
            ? parseInt(component.validate.minLength, 10)
            : component.validate?.minLength;
    if (value != null && minLength && typeof value === 'string') {
        if (value.length < minLength) {
            const error = new FieldError('minLength', { ...context, length: String(minLength) });
            return error;
        }
    }
    return null;
};