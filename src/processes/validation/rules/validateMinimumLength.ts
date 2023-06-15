import _ from 'lodash';

import { FieldError } from 'error';
import { RuleFn, TextFieldComponent } from 'types';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('minLength');
};

export const validateMinimumLength: RuleFn = async (context) => {
    const { component, data } = context;
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const minLength =
        typeof component.validate?.minLength === 'string'
            ? parseInt(component.validate.minLength, 10)
            : component.validate?.minLength;
    const value = _.get(data, component.key);
    if (value && minLength && typeof value === 'string') {
        if (value.length < minLength) {
            const error = new FieldError('minLength', context);
            return error;
        }
    }
    return null;
};
