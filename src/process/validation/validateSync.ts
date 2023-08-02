import * as _ from '@formio/lodash';

import { FieldError } from 'error';
import { rulesSync as allRules } from './rules';
import { shouldSkipValidation } from './util';
import { ProcessorFnSync } from 'types';
import { getErrorMessage } from 'utils/error';

export const validateSync: ProcessorFnSync = (context, rules = allRules) => {
    const { component, data, path } = context;
    if (shouldSkipValidation(component)) {
        return [];
    }
    const errors: FieldError[] = [];
    if (component.multiple) {
        const contextualData = _.get(data, path);
        if (contextualData?.length > 0) {
            for (let i = 0; i < contextualData.length; i++) {
                const amendedPath = `${path}[${i}]`;
                let value = _.get(data, amendedPath);
                if (component.truncateMultipleSpaces && value && typeof value === 'string') {
                    value = value.trim().replace(/\s{2,}/g, ' ');
                }
                for (const rule of rules) {
                    const error = rule({ ...context, value, index: i, path: amendedPath });
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
            const error = rule({ ...context, value });
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
