import _ from 'lodash';

import { FieldError } from 'error';
import { TextFieldComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
    return component && component.validate?.hasOwnProperty('maxLength');
};

const getValidationSetting = (component: any) => {
    let maxLength = (component as TextFieldComponent).validate?.maxLength;
    maxLength = (typeof maxLength === 'string') ? parseInt(maxLength, 10) : maxLength;
    return maxLength;
};

export const shouldValidate = (context: ValidationContext) => {
    const { component, value } = context;
    if (!isValidatableTextFieldComponent(component)) {
        return false;
    }
    if (value === null) {
        return false;
    }
    if (typeof value !== 'string') {
        return false;
    }
    if (!getValidationSetting(component)) {
        return false;
    }
    return true;
};

export const validateMaximumLength: RuleFn = async (context: ValidationContext) => {
    return validateMaximumLengthSync(context);
};

export const validateMaximumLengthSync: RuleFnSync = (context: ValidationContext) => {
    const { component, value } = context;
    if (!shouldValidate(context)) {
        return null;
    }
    const maxLength = getValidationSetting(component);
    if (value != null && maxLength && typeof value === 'string') {
        if (value.length > maxLength) {
            const error = new FieldError('maxLength', { ...context, length: String(maxLength) });
            return error;
        }
    }
    return null;
}

export const validateMaximumLengthInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
    name: 'validateMaximumLength',
    process: validateMaximumLength,
    processSync: validateMaximumLengthSync,
    shouldProcess: shouldValidate,
};
