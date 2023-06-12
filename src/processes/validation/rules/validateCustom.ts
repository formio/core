import _ from 'lodash';

import { RuleFn } from 'types/RuleFn';
import { FieldError } from 'error/FieldError';
import { Evaluator } from 'utils';
import { ProcessType } from 'types/process/ProcessType';
import { getComponentErrorField } from 'validation/util';

export const validateCustom: RuleFn = async (component, data) => {
    const customValidation = component.validate?.custom;
    const value = _.get(data, component.key);
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

    return new FieldError({component, errorKeyOrMessage: isValid, field: getComponentErrorField(component), context: { process: ProcessType.Validation } });
};
