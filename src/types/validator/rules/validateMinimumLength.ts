import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { TextFieldComponent } from '../../types/Component';
import { RuleFn } from '../../types/index';
import { getErrorMessage } from '../../validator/util';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('minLength');
};

export const validateMinimumLength: RuleFn = async (component, data) => {
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
            const error = new FieldError(
                component,
                getErrorMessage(component, `must have at least ${minLength} characters`)
            );
            return error;
        }
    }
    return null;
};
