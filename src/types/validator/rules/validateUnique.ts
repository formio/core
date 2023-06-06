import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { RuleFn } from '../../types/index';
import { getErrorMessage, isEmptyObject } from '../util';

export const validateUnique: RuleFn = async (component, data, config) => {
    if (!component.unique) {
        return null;
    }

    const value = _.get(data, component.key);
    if (!value || isEmptyObject(value)) {
        return null;
    }

    const isUnique = config.database?.isUnique(value);
    return isUnique
        ? null
        : new FieldError(component, getErrorMessage(component, 'is not a unique submission'));
};
