import get from 'lodash/get';
import { rules, rulesSync } from './rules';
import { shouldSkipValidation } from './util';
import { ProcessorContext, ProcessorFn, ProcessorFnSync, ValidationScope } from 'types';
import { getErrorMessage } from 'utils/error';

export const validateProcess: ProcessorFn<ValidationScope> = async (context: ProcessorContext<ValidationScope>) => {
    const { component, data, path, instance, scope } = context;
    if (component.multiple) {
        const contextualData: any = get(data, path);
        if (contextualData.length > 0) {
            for (let i = 0; i < contextualData.length; i++) {
                const amendedPath = `${path}[${i}]`;
                let value = get(data, amendedPath);
                if (instance?.shouldSkipValidation(data) || shouldSkipValidation(component, data)) {
                    return;
                }
                if (component.truncateMultipleSpaces && value && typeof value === 'string') {
                    value = value.trim().replace(/\s{2,}/g, ' ');
                }
                for (const rule of rules) {
                    const error = await rule({ ...context, value, index: i, path: amendedPath });
                    if (error) {
                        scope.errors.push(error);
                    }
                }
            }
            return;
        }
    }
    let value = get(data, path);
    if (instance?.shouldSkipValidation(data) || shouldSkipValidation(component, data)) {
        return;
    }
    if (component.truncateMultipleSpaces && value && typeof value === 'string') {
        value = value.trim().replace(/\s{2,}/g, ' ');
    }
    for (const rule of rules ) {
        try {
            const error = await rule({ ...context, value });
            if (error) {
                scope.errors.push(error);
            }
        }
        catch (err) {
            console.error("Validator error:", getErrorMessage(err));
        }
    }
    return;
};

export const validateProcessSync: ProcessorFnSync<ValidationScope> = (context: ProcessorContext<ValidationScope>) => {
    const { component, data, path, instance, scope } = context;
    if (component.multiple) {
        const contextualData: any = get(data, path);
        if (contextualData?.length > 0) {
            for (let i = 0; i < contextualData.length; i++) {
                const amendedPath = `${path}[${i}]`;
                let value = get(data, amendedPath);
                if (instance?.shouldSkipValidation(data) || shouldSkipValidation(component, data)) {
                    return;
                }
                if (component.truncateMultipleSpaces && value && typeof value === 'string') {
                    value = value.trim().replace(/\s{2,}/g, ' ');
                }
                for (const rule of rulesSync) {
                    const error = rule({ ...context, value, index: i, path: amendedPath });
                    if (error) {
                        scope.errors.push(error);
                    }
                }
            }
            return;
        }
    }
    let value = get(data, path);
    if (instance?.shouldSkipValidation(data) || shouldSkipValidation(component, data)) {
        return;
    }
    if (component.truncateMultipleSpaces && value && typeof value === 'string') {
        value = value.trim().replace(/\s{2,}/g, ' ');
    }
    for (const rule of rulesSync ) {
        try {
            const error = rule({ ...context, value });
            if (error) {
                scope.errors.push(error);
            }
        }
        catch (err) {
            console.error("Validator error:", getErrorMessage(err));
        }
    }
    return;
};
