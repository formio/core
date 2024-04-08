import { isEmpty } from 'lodash';
import { RuleFn, RuleFnSync } from 'types/RuleFn';
import { FieldError } from 'error/FieldError';
import { Evaluator } from 'utils';
import { ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

export const validateCustom: RuleFn = async (context: ValidationContext) => {
    return validateCustomSync(context);
};

export const shouldValidate = (context: ValidationContext) => {
    const { component, value } = context;
    const customValidation = component.validate?.custom;
    if (!customValidation) {
        return false;
    }
    return true;
}

export const validateCustomSync: RuleFnSync = (context: ValidationContext) => {
    const { component, data, row, value, index, instance, evalContext } = context;
    const customValidation = component.validate?.custom;
    if (!shouldValidate(context)) {
        return null;
    }

    const evalContextValue = {
        ...(instance?.evalContext ? instance.evalContext() : (evalContext ? evalContext(context) : context)),
        component,
        data,
        row,
        rowIndex: index,
        instance,
        valid: true,
        input: value,
    }

    const isValid = Evaluator.evaluate(
        customValidation,
        evalContextValue,
        'valid',
        true,
        {},
        {}
    );

    if (isValid === null || isValid === true) {
        return null;
    }

    return new FieldError(typeof isValid === 'string' ? isValid : 'custom', {
        ...context,
        hasLabel: false,
        setting: customValidation,
    }, 'custom');
};


export const validateCustomInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
    name: 'validateCustom',
    process: validateCustom,
    processSync: validateCustomSync,
    shouldProcess: shouldValidate
};
