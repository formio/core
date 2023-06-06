import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { ValidatorError } from '../../error/ValidatorError';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from '../../validator/util';

export const validateJson: RuleFn = async (component, data, config) => {
    const value = _.get(data, component.key);
    if (!value || !component.validate?.json) {
        return null;
    }
    if (!config.evaluator) {
        throw new ValidatorError('Cannot evaluate JSON logic without an evaluator');
    }

    const func = JSON.stringify(component.validate.json);
    const error = new FieldError(
        component,
        getErrorMessage(component, 'fails JSON logic validation')
    );
    const valid: true | string = config.evaluator.evaluate(
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
        : new FieldError(
              component,
              getErrorMessage(component, `fails JSON logic validation: ${valid}`)
          );
};
