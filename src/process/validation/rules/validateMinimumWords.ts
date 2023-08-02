import _ from 'lodash';

import { FieldError } from 'error/FieldError';
import { RuleFn, RuleFnSync, TextFieldComponent } from 'types';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('minWords');
};

export const validateMinimumWords: RuleFn = async (context) => {
    return validateMinimumWordsSync(context);
};

export const validateMinimumWordsSync: RuleFnSync = (context) => {
    const { component, value } = context;
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const minWords =
        typeof component.validate?.minWords === 'string'
            ? parseInt(component.validate.minWords, 10)
            : component.validate?.minWords;

    if (minWords && typeof value === 'string') {
        if (value.trim().split(/\s+/).length < minWords) {
            const error = new FieldError('minWords', { ...context, length: String(minWords) });
            return error;
        }
    }
    return null;
};
