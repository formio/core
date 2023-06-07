import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from '../util';
import jsonLogic from 'modules/jsonlogic';

export const validateJson: RuleFn = async (component, data) => {
    const value = _.get(data, component.key);
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
        : new FieldError(
              component,
              getErrorMessage(component, `fails JSON logic validation: ${valid}`)
          );
};
