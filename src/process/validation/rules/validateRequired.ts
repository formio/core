import _ from 'lodash';

import { FieldError } from 'error';
import { RuleFn } from 'types';
import { isEmptyObject } from '../util';

export const validateRequired: RuleFn = async (context) => {
    const error = new FieldError('required', context);
    const { component, value } = context;
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
