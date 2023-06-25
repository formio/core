import * as _ from '@formio/lodash';

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
    const { component, data, path } = context;
    if (component.multiple) {
        const contextualData = _.get(data, path);
        if (contextualData.length > 0) {
            for (let i = 0; i < contextualData.length; i++) {
                const amendedPath = `${path}[${i}]`;
                const value = _.get(data, amendedPath);
                for (const rule of rules) {
                    const error = await rule({ ...context, value, index: i, path: amendedPath });
                    if (error) {
                        errors.push(error);
                    }
                }
            }
            return errors;
        }
    }
    const value = _.get(data, path);
    for (const rule of rules ) {
        try {
            const error = await rule({ ...context, value });
            if (error) {
                errors.push(error);
            }
        }
        catch (err) {
            console.error("Validator error:", getErrorMessage(err));
        }
    }
    return errors;
};
