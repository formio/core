import _ from 'lodash';

import jsonLogic from 'modules/jsonlogic';
import { FieldError } from 'error';
import { RuleFn, ProcessType } from 'types';
import { getComponentErrorField } from 'validation/util';

export const validateJson: RuleFn = async (component, data, config) => {
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
        : new FieldError({ component, errorKeyOrMessage: 'jsonLogic', field: getComponentErrorField(component), context: config?.context });
};
