import _ from 'lodash';

import { RuleFn, RuleFnSync } from 'types/RuleFn';
import { FieldError } from 'error/FieldError';
import { Evaluator } from 'utils';

export const validateCustom: RuleFn = async (context) => {
    return validateCustomSync(context);
};

export const validateCustomSync: RuleFnSync = (context) => {
    const { component, data, row, value, instance } = context;
    const customValidation = component.validate?.custom;
    if (!customValidation || !value || ((typeof value === 'string' || typeof value === 'object') && _.isEmpty(value))) {
        return null;
    }

    const isValid = Evaluator.evaluate(
        customValidation,
        {
            valid: true,
            data,
            row,
            input: value,
            ...(instance ? instance.evalContext() : {})
        },
        'valid',
        true,
        {},
        {}
    );

    if (isValid === null || isValid === true) {
        return null;
    }

    return new FieldError(isValid, {...context, hasLabel: false });
};
