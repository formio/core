import _ from 'lodash';

import { FieldError } from 'error/FieldError';
import { RuleFn, TextFieldComponent } from 'types';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('minWords');
};

export const validateMinimumWords: RuleFn = async (context) => {
    const { component, data } = context;
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
            const error = new FieldError('minWords', context);
            return error;
        }
    }
    return null;
};
