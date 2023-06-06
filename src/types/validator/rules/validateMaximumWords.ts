import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { TextFieldComponent } from '../../types/Component';
import { RuleFn } from '../../types/index';
import { getErrorMessage } from '../../validator/util';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('maxWords');
};

export const validateMaximumWords: RuleFn = async (component, data) => {
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const maxWords =
        typeof component.validate?.maxWords === 'string'
            ? parseInt(component.validate.maxWords, 10)
            : component.validate?.maxWords;
    const value = _.get(data, component.key);

    if (maxWords && typeof value === 'string') {
        if (value.trim().split(/\s+/).length > maxWords) {
            const error = new FieldError(
                component,
                getErrorMessage(component, `must have no more than ${maxWords} words.`)
            );
            return error;
        }
    }
    return null;
};
