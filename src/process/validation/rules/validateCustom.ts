import _ from 'lodash';

import { RuleFn } from 'types/RuleFn';
import { FieldError } from 'error/FieldError';
import { Evaluator } from 'utils';

export const validateCustom: RuleFn = async (context) => {
    const { component, data, path} = context;
    const customValidation = component.validate?.custom;
    const value = _.get(data, path);
    if (!customValidation) {
        return null;
    }

    const isValid = Evaluator.evaluate(
        customValidation,
        {
            valid: true,
            data,
            input: value,
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
