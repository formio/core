import * as _ from '@formio/lodash';

import { FieldError } from 'error';
import { rules as allRules } from './rules';
import { shouldSkipValidation } from './util';
import { ProcessorFn } from 'types';
import { getErrorMessage } from 'utils/error';

export const validate: ProcessorFn = async (context, rules = allRules) => {
    const { component, data, path } = context;
    if (shouldSkipValidation(component)) {
        return [];
    }
    const errors: FieldError[] = [];
    if (component.multiple) {
        const contextualData = _.get(data, path);
        if (contextualData.length > 0) {
            for (let i = 0; i < contextualData.length; i++) {
                const amendedPath = `${path}[${i}]`;
                let value = _.get(data, amendedPath);
                if (component.truncateMultipleSpaces && value && typeof value === 'string') {
                    value = value.trim().replace(/\s{2,}/g, ' ');
                }
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
    let value = _.get(data, path);
    if (component.truncateMultipleSpaces && value && typeof value === 'string') {
        value = value.trim().replace(/\s{2,}/g, ' ');
    }
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
