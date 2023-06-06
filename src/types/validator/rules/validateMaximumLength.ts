import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { TextFieldComponent } from '../../types/Component';
import { RuleFn } from '../../types/index';
import { getErrorMessage } from '../../validator/util';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('maxLength');
};

export const validateMaximumLength: RuleFn = async (component, data) => {
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const maxLength =
        typeof component.validate?.maxLength === 'string'
            ? parseInt(component.validate.maxLength, 10)
            : component.validate?.maxLength;
    const value = _.get(data, component.key);
    if (value && maxLength && typeof value === 'string') {
        if (value.length > maxLength) {
            const error = new FieldError(
                component,
                getErrorMessage(component, `must have no more than ${maxLength} characters`)
            );
            return error;
        }
    }
    return null;
};
