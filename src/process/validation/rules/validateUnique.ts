import _ from 'lodash';

import { FieldError } from '../../../error/FieldError';
import { RuleFn } from '../../../types/index';
import { isEmptyObject } from '../util';
import { ValidatorError } from 'error';

export const validateUnique: RuleFn = async (context) => {
    const { component, value, config } = context;
    if (!component.unique) {
        return null;
    }

    if (!value || isEmptyObject(value)) {
        return null;
    }

    if (!config) {
        throw new ValidatorError("Can't test for unique value without a database config object");
    }
    const isUnique = await config.database?.isUnique(value);
    return isUnique
        ? null
        : new FieldError('unique', context);
};
