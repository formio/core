import _ from 'lodash';

import { FieldError } from 'error';
import { TextFieldComponent, RuleFn, RuleFnSync } from 'types';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('maxLength');
};

export const validateMaximumLength: RuleFn = async (context) => {
    return validateMaximumLengthSync(context);
};

export const validateMaximumLengthSync: RuleFnSync = (context) => {
    const { component, value } = context;
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const maxLength =
        typeof component.validate?.maxLength === 'string'
            ? parseInt(component.validate.maxLength, 10)
            : component.validate?.maxLength;
    if (value != null && maxLength && typeof value === 'string') {
        if (value.length > maxLength) {
            const error = new FieldError('maxLength', { ...context, length: String(maxLength) });
            return error;
        }
    }
    return null;
}
