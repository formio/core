import _ from 'lodash';

import jsonLogic from 'modules/jsonlogic';
import { FieldError } from 'error';
import { RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

export const shouldValidate = (context: ValidationContext) => {
    const { component, value } = context;
    if (!value || !component.validate?.json) {
        return false;
    }
    return true;
};

export const validateJson: RuleFn = async (context: ValidationContext) => {
    return validateJsonSync(context);
};

export const validateJsonSync: RuleFnSync = (context: ValidationContext) => {
    const { component, data, value } = context;
    if (!shouldValidate(context)) {
        return null;
    }

    const func = component?.validate?.json;
    const valid: true | string = jsonLogic.evaluator.evaluate(
        func,
        {
            data,
            input: value,
        },
        'valid'
    );
    if (valid === null) {
        return null;
    }
    return valid === true
        ? null
        : new FieldError(valid || 'jsonLogic', context);
};

export const validateJsonInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
    name: 'validateJson',
    process: validateJson,
    processSync: validateJsonSync,
    shouldProcess: shouldValidate,
};
