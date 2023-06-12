import _ from 'lodash';

import { FieldError } from 'error';
import { TextFieldComponent, RuleFn, ProcessType } from 'types';
import { getComponentErrorField } from 'validation/util';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('maxWords');
};

export const validateMaximumWords: RuleFn = async (component, data, config) => {
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
            const error = new FieldError({ component, errorKeyOrMessage: 'maxWords', field: getComponentErrorField(component), context: config?.context });
            return error;
        }
    }
    return null;
};
