import _ from 'lodash';

import { FieldError } from 'error';
import { TextFieldComponent, RuleFn } from 'types';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('maxWords');
};

export const validateMaximumWords: RuleFn = async (context) => {
    const { component, data, path } = context;
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const maxWords =
        typeof component.validate?.maxWords === 'string'
            ? parseInt(component.validate.maxWords, 10)
            : component.validate?.maxWords;
    const value = _.get(data, path);

    if (maxWords && typeof value === 'string') {
        if (value.trim().split(/\s+/).length > maxWords) {
            const error = new FieldError('maxWords', context);
            return error;
        }
    }
    return null;
};
