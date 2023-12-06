import _ from 'lodash';

import { FieldError, ValidatorError } from 'error';
import { NumberComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableNumberComponent = (component: any): component is NumberComponent => {
    return component && component.validate?.hasOwnProperty('max');
};

const getValidationSetting = (component: any) => {
    let max = (component as NumberComponent).validate?.max;
    if (typeof max === 'string') {
        max = parseFloat(max);
    }
    return max;
};

export const shouldValidate = (context: ValidationContext) => {
    const { component, value } = context;
    if (!isValidatableNumberComponent(component)) {
        return false;
    }
    if (value === null) {
        return false;
    }
    if (!getValidationSetting(component)) {
        return false;
    }
    return true;
};

export const validateMaximumValue: RuleFn = async (context: ValidationContext) => {
    return validateMaximumValueSync(context);
};

export const validateMaximumValueSync: RuleFnSync = (context: ValidationContext) => {
    const { component, value } = context;
    if (!shouldValidate(context)) {
        return null;
    }
    const max = getValidationSetting(component);
    if (!max) {
        return null;
    }
    const parsedValue = typeof value === 'string' ? parseFloat(value) : Number(value);

    if (Number.isNaN(max)) {
        throw new ValidatorError(`Cannot evaluate maximum value ${max} because it is invalid`);
    }
    if (Number.isNaN(parsedValue)) {
        throw new ValidatorError(
            `Cannot validate value ${parsedValue} because it is invalid`
        );
    }

    return parsedValue <= max
        ? null
        : new FieldError('max', {...context, max: String(max) });
};

export const validateMaximumValueInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
    name: 'validateMaximumValue',
    process: validateMaximumValue,
    processSync: validateMaximumValueSync,
    shouldProcess: shouldValidate,
};