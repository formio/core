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
    for (const rule of rules ) {
        try {
            if (component.multiple) {
                const contextualData = _.get(data, path);
                if (contextualData.length > 0) {
                    for (let i = 0; i < contextualData.length; i++) {
                        const amendedPath = `${path}[${i}]`;
                        const error = await rule({ ...context, path: amendedPath });
                        if (error) {
                            errors.push(error);
                        }
                    }
                    continue;
                }
            }
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
