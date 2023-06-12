import _ from 'lodash';

import { FieldError } from 'error';
import { ProcessType, RuleFn } from 'types';
import { getComponentErrorField, isEmptyObject } from '../util';

export const validateRequired: RuleFn = async (component, data, config) => {
    const error = new FieldError({ component, errorKeyOrMessage: 'required', field: getComponentErrorField(component), context: config?.context });
    const value = _.get(data, component.key);
    if (component.validate?.required) {
        if (Array.isArray(value) && value.length === 0) {
            return error;
        }
        if (
            (value === null || value === undefined || isEmptyObject(value) || !!value === false) &&
            !component.hidden
        ) {
            return error;
        }
    }
    return null;
};
