import { ProcessorFn, ProcessorFnSync, ProcessorInfo, ValidationContext, ValidationRuleInfo, ValidationScope } from "types";
import { shouldValidate } from './util';
import { getErrorMessage } from 'utils/error';
import get from 'lodash/get';

export const validateProcess: ProcessorFn<ValidationScope> = async (context: ValidationContext) => {
    const { component, data, path, instance, scope } = context;
    const rules: ValidationRuleInfo[] = scope.rules?.length ? scope.rules : [];
    if (!rules || !rules.length) {
        return;
    }
    if (component.multiple) {
        const contextualData: any = get(data, path);
        if (contextualData.length > 0) {
            for (let i = 0; i < contextualData.length; i++) {
                const amendedPath = `${path}[${i}]`;
                let value = get(data, amendedPath);
                if (instance?.shouldSkipValidation(data) || !shouldValidate(context)) {
                    return;
                }
                if (component.truncateMultipleSpaces && value && typeof value === 'string') {
                    value = value.trim().replace(/\s{2,}/g, ' ');
                }
                for (const rule of rules) {
                    if (rule && rule.process) {
                        const error = await rule.process({ ...context, value, index: i, path: amendedPath });
                        if (error) {
                            scope.errors.push(error);
                        }
                    }
                }
            }
            return;
        }
    }
    let value = get(data, path);
    if (instance?.shouldSkipValidation(data) || !shouldValidate(context)) {
        return;
    }
    if (component.truncateMultipleSpaces && value && typeof value === 'string') {
        value = value.trim().replace(/\s{2,}/g, ' ');
    }
    for (const rule of rules) {
        try {
            if (rule && rule.process) {
                const error = await rule.process({ ...context, value });
                if (error) {
                    scope.errors.push(error);
                }
            }
        }
        catch (err) {
            console.error("Validator error:", getErrorMessage(err));
        }
    }
    return;
};

export const validateProcessSync: ProcessorFnSync<ValidationScope> = (context: ValidationContext) => {
    const { component, data, path, instance, scope } = context;
    const rules: ValidationRuleInfo[] = scope.rules?.length ? scope.rules : [];
    if (!rules || !rules.length) {
        return;
    }
    if (component.multiple) {
        const contextualData: any = get(data, path);
        if (contextualData?.length > 0) {
            for (let i = 0; i < contextualData.length; i++) {
                const amendedPath = `${path}[${i}]`;
                let value = get(data, amendedPath);
                if (instance?.shouldSkipValidation(data) || !shouldValidate(context)) {
                    return;
                }
                if (component.truncateMultipleSpaces && value && typeof value === 'string') {
                    value = value.trim().replace(/\s{2,}/g, ' ');
                }
                for (const rule of rules) {
                    if (rule && rule.processSync) {
                        const error = rule.processSync({ ...context, value, index: i, path: amendedPath });
                        if (error) {
                            scope.errors.push(error);
                        }
                    }
                }
            }
            return;
        }
    }
    let value = get(data, path);
    if (instance?.shouldSkipValidation(data) || !shouldValidate(context)) {
        return;
    }
    if (component.truncateMultipleSpaces && value && typeof value === 'string') {
        value = value.trim().replace(/\s{2,}/g, ' ');
    }
    for (const rule of rules) {
        try {
            if (rule && rule.processSync) {
                const error = rule.processSync({ ...context, value });
                if (error) {
                    scope.errors.push(error);
                }
            }
        }
        catch (err) {
            console.error("Validator error:", getErrorMessage(err));
        }
    }
    return;
};
