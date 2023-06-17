import _ from 'lodash';

import { FieldError } from 'error';
import { TextAreaComponent, TextFieldComponent, RuleFn } from 'types';

const isValidatableTextFieldComponent = (
    component: any
): component is TextFieldComponent | TextAreaComponent => {
    return component && component.validate?.hasOwnProperty('pattern');
};

export const validateRegexPattern: RuleFn = async (context) => {
    const { component, data, path } = context;
    if (!isValidatableTextFieldComponent(component)) {
        return null;
    }
    const value = _.get(data, path);

    const pattern = component.validate?.pattern;
    if (!pattern) {
        return null;
    }
    const regex = new RegExp(`^${pattern}$`);
    return typeof value === 'string' && regex.test(value)
        ? null
        : new FieldError('regex', context);
};
