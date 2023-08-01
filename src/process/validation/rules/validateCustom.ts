import _ from 'lodash';

import { RuleFn, RuleFnSync } from 'types/RuleFn';
import { FieldError } from 'error/FieldError';
import { Evaluator } from 'utils';

export const validateCustom: RuleFn = async (context) => {
    return validateCustomSync(context);
};

export const validateCustomSync: RuleFnSync = (context) => {
    const { component, data, value, evalContext } = context;
    const customValidation = component.validate?.custom;
    if (!customValidation) {
        return null;
    }

    const isValid = Evaluator.evaluate(
        customValidation,
        {
            valid: true,
            data,
            input: value,
            ...evalContext,
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
