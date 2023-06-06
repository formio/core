import _ from 'lodash';

import { RuleFn } from '../../types/RuleFn';
import { ValidatorError } from '../../error/ValidatorError';
import { FieldError } from '../../error/FieldError';
import { getErrorMessage } from '../../validator/util';

export const validateCustom: RuleFn = async (component, data, config) => {
    const customValidation = component.validate?.custom;
    const value = _.get(data, component.key);
    if (!customValidation) {
        return null;
    }
    if (!config.evaluator) {
        throw new ValidatorError('Cannot evaluate custom validation rule without an evaluator');
    }

    const isValid = config.evaluator.evaluate(
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

    return new FieldError(component, getErrorMessage(component, isValid, true));
};
