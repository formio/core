import { FieldError } from '../../error/FieldError';
import { rules as allRules } from './rules';
import { shouldSkipValidation } from './util';
import { ProcessFn } from 'types/process/ProcessFn';

export const process: ProcessFn = async ({ component, data, rules = allRules, config = {} }) => {
    if (shouldSkipValidation(component)) {
        return [];
    }
    const errors: FieldError[] = [];
    for (const rule of rules) {
        const error = await rule(component, data, config);
        if (error) {
            errors.push(error);
        }
    }
    return errors;
};
