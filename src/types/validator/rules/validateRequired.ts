import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { RuleFn } from '../../types/index';
import { getErrorMessage, isEmptyObject } from '../util';

export const validateRequired: RuleFn = async (component, data) => {
    const error = new FieldError(component, getErrorMessage(component, 'is required, you ninny'));
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
