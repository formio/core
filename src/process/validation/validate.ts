import { FieldError } from 'error';
import { rules as allRules } from './rules';
import { shouldSkipValidation } from './util';
import { ProcessorFn } from 'types';
import { getErrorMessage } from 'utils/error';

export const validate: ProcessorFn = async (context, rules = allRules) => {
    if (shouldSkipValidation(context.component)) {
        return [];
    }
    const errors: FieldError[] = [];
    for (const rule of rules ) {
        try {
            const error = await rule(context);
            if (error) {
                errors.push(error);
            }
        }
        catch (err) {
            console.error(getErrorMessage(err));
        }
    }
    return errors;
};
