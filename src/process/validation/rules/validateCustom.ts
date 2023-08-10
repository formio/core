import _ from 'lodash';

import { RuleFn, RuleFnSync } from 'types/RuleFn';
import { FieldError } from 'error/FieldError';
import { Evaluator } from 'utils';

export const validateCustom: RuleFn = async (context) => {
    return validateCustomSync(context);
};

export const validateCustomSync: RuleFnSync = (context) => {
    const { component, data, row, value, index, instance } = context;
    const customValidation = component.validate?.custom;
    if (!customValidation || !value || ((typeof value === 'string' || typeof value === 'object') && _.isEmpty(value))) {
        return null;
    }

    const evalContext = {
        ...(instance?.evalContext ? instance.evalContext() : {}),
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
        evalContext,
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
