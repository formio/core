import _ from 'lodash';

import { FieldError } from 'error';
import { TextFieldComponent, RuleFn, ProcessType } from 'types';
import { getComponentErrorField } from 'validation/util';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('maxLength');
};

export const validateMaximumLength: RuleFn = async (component, data, config) => {
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
            const error = new FieldError({
                component,
                errorKeyOrMessage: 'maxLength',
                field: getComponentErrorField(component),
                context: config?.context,
            });
            return error;
        }
    }
    return null;
};
