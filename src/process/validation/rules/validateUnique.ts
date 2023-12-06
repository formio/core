import _ from 'lodash';

import { FieldError } from '../../../error/FieldError';
import { RuleFn, ValidationContext } from '../../../types/index';
import { isEmptyObject } from '../util';
import { ValidatorError } from 'error';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

export const shouldValidate = (context: ValidationContext) => {
    const { component, value } = context;
    if (!component.unique) {
        return false;
    }

    if (!value || isEmptyObject(value)) {
        return false;
    }
    return true;
};

export const validateUnique: RuleFn = async (context: ValidationContext) => {
    const { value, config } = context;
    if (!shouldValidate(context)) {
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

export const validateUniqueInfo: ProcessorInfo<ValidationContext, FieldError | null>  = {
    name: 'validateUnique',
    process: validateUnique,
    shouldProcess: shouldValidate,
};
