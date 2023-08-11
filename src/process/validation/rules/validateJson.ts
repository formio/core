import _ from 'lodash';

import jsonLogic from 'modules/jsonlogic';
import { FieldError } from 'error';
import { RuleFn, RuleFnSync } from 'types';

export const validateJson: RuleFn = async (context) => {
    return validateJsonSync(context);
};

export const validateJsonSync: RuleFnSync = (context) => {
    const { component, data, value } = context;
    if (!value || !component.validate?.json) {
        return null;
    }

    const func = component.validate.json;
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
