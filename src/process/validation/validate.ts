import { FieldError } from '../../error/FieldError';
import { rules as allRules } from './rules';
import { shouldSkipValidation } from './util';
import { ProcessorFn } from 'types/process/ProcessorFn';

export const validate: ProcessorFn = async (context, rules = allRules) => {
    if (shouldSkipValidation(context.component)) {
        return [];
    }
    const errors: FieldError[] = [];
    for (const rule of rules ) {
        const error = await rule(context);
        if (error) {
            errors.push(error);
        }
    }
    return errors;
};
