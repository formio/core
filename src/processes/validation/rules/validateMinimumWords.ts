import _ from 'lodash';

import { FieldError } from 'error/FieldError';
import { ProcessType, RuleFn, TextFieldComponent } from 'types';
import { getComponentErrorField } from 'validation/util';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('minWords');
};

export const validateMinimumWords: RuleFn = async (component, data, config) => {
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
            const error = new FieldError({
                component,
                errorKeyOrMessage: 'minWords',
                field: getComponentErrorField(component),
                context: config?.context,
            });
            return error;
        }
    }
    return null;
};
