import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { TextFieldComponent } from '../../types/Component';
import { RuleFn } from '../../types/index';
import { getErrorMessage } from '../../validator/util';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('minWords');
};

export const validateMinimumWords: RuleFn = async (component, data) => {
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const minWords =
        typeof component.validate?.minWords === 'string'
            ? parseInt(component.validate.minWords, 10)
            : component.validate?.minWords;
    const value = _.get(data, component.key);

    if (minWords && typeof value === 'string') {
        if (value.trim().split(/\s+/).length < minWords) {
            const error = new FieldError(
                component,
                getErrorMessage(component, `must have at least ${minWords} words.`)
            );
            return error;
        }
    }
    return null;
};
