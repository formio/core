import _ from 'lodash';

import jsonLogic from 'modules/jsonlogic';
import { FieldError } from 'error';
import { RuleFn } from 'types';

export const validateJson: RuleFn = async (context) => {
    const { component, data, path } = context;
    const value = _.get(data, path);
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
        : new FieldError('jsonLogic', context);
};
