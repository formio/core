import _ from 'lodash';

import { FieldError } from 'error';
import { TextAreaComponent, TextFieldComponent, RuleFn, RuleFnSync } from 'types';

const isValidatableTextFieldComponent = (
    component: any
): component is TextFieldComponent | TextAreaComponent => {
    return component && component.validate?.hasOwnProperty('pattern');
};

export const validateRegexPattern: RuleFn = async (context) => {
    const { component, value } = context;
    if (!isValidatableTextFieldComponent(component) || !value) {
        return null;
    }

    const pattern = component.validate?.pattern;
    if (!pattern) {
        return null;
    }
    const regex = new RegExp(`^${pattern}$`);
    return typeof value === 'string' && regex.test(value)
        ? null
        : new FieldError('pattern', { ...context, regex: pattern, pattern: pattern });
};

export const validateRegexPatternSync: RuleFnSync = (context) => {
    const { component, value } = context;
    if (!isValidatableTextFieldComponent(component) || !value) {
        return null;
    }

    const pattern = component.validate?.pattern;
    if (!pattern) {
        return null;
    }
    const regex = new RegExp(`^${pattern}$`);
    return typeof value === 'string' && regex.test(value)
        ? null
        : new FieldError('pattern', { ...context, regex: pattern, pattern: pattern });
};
