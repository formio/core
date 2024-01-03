import { ConditionsScope, ProcessorFn, ProcessorFnSync, ProcessorInfo, ValidationContext, ValidationProcessorFn, ValidationProcessorFnSync, ValidationRuleInfo, ValidationScope } from "types";
import { EvaluationRules, Rules, ServerRules } from "./rules";
import { find, get, pick } from "lodash";
import { getComponentPath } from "utils/formUtil";
import { getErrorMessage } from "utils/error";
import { FieldError } from "error";

// Cleans up validation errors to remove unnessesary parts
// and make them transferable to ivm.
const cleanupValidationError = (error: any) => ({
    ...error,
    context: pick(error.context,
        [
            'component', 
            'path', 
            'index', 
            'value', 
            'field', 
            'hasLabel', 
            'processor', 
            'setting',
            'pattern',
            'length',
            'min',
            'max',
            'maxDate',
            'minDate',
            'maxYear',
            'minYear',
            'minCount',
            'maxCount',
            'regex'
        ]
    ),
});

export function shouldValidate(context: ValidationContext, rules: ValidationRuleInfo[]): boolean {
    const { component, scope, path, config } = context;
    if (component.hasOwnProperty('input') && !component.input) {
        return false;
    }
    // Server validation is skipped if the value is not persistent on the server.
    if (config?.server && (component.persistent === false || (component.persistent === 'client-only'))) {
        return false;
    }
    // Do not perform validation on conditionally hidden components.
    if (find((scope as ConditionsScope).conditionals, {path: getComponentPath(component, path), conditionallyHidden: true})) {
        return false;
    }
    return rules.reduce((acc, rule: ValidationRuleInfo) => {
        return acc || rule.shouldProcess(context);
    }, false);
}

export function shouldValidateAll(context: ValidationContext): boolean {
    return shouldValidate(context, Rules);
}

export function shouldValidateCustom(context: ValidationContext): boolean {
    const { component } = context;
    if (component.customConditional) {
        return true;
    }
    return false;
}

export function shouldValidateServer(context: ValidationContext): boolean {
    const { component } = context;
    if (shouldValidateCustom(context)) {
        return false;
    }
    return shouldValidate(context, Rules);
}

function handleError(error: FieldError | null, context: ValidationContext) {
    const { path, scope } = context;
    if (error) {
        const cleanedError = cleanupValidationError(error);
        if (!find(scope.errors, { errorKeyOrMessage: cleanedError.errorKeyOrMessage, context: {path} })) {
            if (!scope.validated) scope.validated = [];
            if (!scope.errors) scope.errors = [];
            scope.errors.push(cleanedError);
            scope.validated.push({ path, error: cleanedError });
        }
    }
}

export const validateProcess: ValidationProcessorFn = async (context) => {
    const { component, data, path, instance, scope, rules } = context;
    let { value } = context;
    if (!scope.validated) scope.validated = [];
    if (!scope.errors) scope.errors = [];
    if (!rules || !rules.length) {
        return;
    }
    if (component.multiple && Array.isArray(value) && value.length > 0) {
        const fullValueRules = rules.filter(rule => rule.fullValue);
        const otherRules = rules.filter(rule => !rule.fullValue);
        for (let i = 0; i < value.length; i++) {
            const amendedPath = `${path}[${i}]`;
            let amendedValue = get(data, amendedPath);
            if (instance?.shouldSkipValidation(data) || !shouldValidate(context, Rules)) {
                return;
            }
            if (component.truncateMultipleSpaces && amendedValue && typeof amendedValue === 'string') {
                amendedValue = amendedValue.trim().replace(/\s{2,}/g, ' ');
            }
            for (const rule of otherRules) {
                if (rule && rule.process) {
                    handleError(await rule.process({ 
                        ...context, 
                        value: amendedValue, 
                        index: i, 
                        path: amendedPath 
                    }), context);
                }
            }
        }
        for (const rule of fullValueRules) {
            if (rule && rule.process) {
                handleError(await rule.process({ 
                    ...context, 
                    value
                }), context);
            }
        }
        return;
    }
    if (instance?.shouldSkipValidation(data) || !shouldValidate(context, Rules)) {
        return;
    }
    if (component.truncateMultipleSpaces && value && typeof value === 'string') {
        value = value.trim().replace(/\s{2,}/g, ' ');
    }
    for (const rule of rules) {
        try {
            if (rule && rule.process) {
                handleError(await rule.process({ ...context, value }), context);
            }
        }
        catch (err) {
            console.error("Validator error:", getErrorMessage(err));
        }
    }
    return;
};

export const validateProcessSync: ValidationProcessorFnSync = (context) => {
    const { component, data, path, instance, scope, rules } = context;
    let { value } = context;
    if (!scope.validated) scope.validated = [];
    if (!scope.errors) scope.errors = [];
    if (!rules || !rules.length) {
        return;
    }
    if (component.multiple && Array.isArray(value) && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
            const amendedPath = `${path}[${i}]`;
            let amendedValue = get(data, amendedPath);
            if (instance?.shouldSkipValidation(data) || !shouldValidate(context, Rules)) {
                return;
            }
            if (component.truncateMultipleSpaces && amendedValue && typeof amendedValue === 'string') {
                amendedValue = amendedValue.trim().replace(/\s{2,}/g, ' ');
            }
            for (const rule of rules) {
                if (rule && rule.processSync) {
                    handleError(rule.processSync({ ...context, value: amendedValue, index: i, path: amendedPath }), context);
                }
            }
        }
        return;
    }
    if (instance?.shouldSkipValidation(data) || !shouldValidate(context, Rules)) {
        return;
    }
    if (component.truncateMultipleSpaces && value && typeof value === 'string') {
        value = value.trim().replace(/\s{2,}/g, ' ');
    }
    for (const rule of rules) {
        try {
            if (rule && rule.processSync) {
                handleError(rule.processSync({ ...context, value }), context);
            }
        }
        catch (err) {
            console.error("Validator error:", getErrorMessage(err));
        }
    }
    return;
};

export const validateCustomProcess: ValidationProcessorFn = async (context) => {
    context.rules = context.rules || EvaluationRules;
    return validateProcess(context);
};

export const validateCustomProcessSync: ProcessorFnSync<ValidationScope> = (context: ValidationContext) => {
    context.rules = context.rules || EvaluationRules;
    return validateProcessSync(context);
};

export const validateServerProcess: ValidationProcessorFn = async (context) => {
    context.rules = context.rules || ServerRules;
    return validateProcess(context);
};

export const validateServerProcessSync: ProcessorFnSync<ValidationScope> = (context: ValidationContext) => {
    context.rules = context.rules || ServerRules;
    return validateProcessSync(context);
};

export const validateAllProcess: ProcessorFn<ValidationScope> = async (context: ValidationContext) => {
    context.rules = context.rules || Rules;
    return validateProcess(context);
};

export const validateAllProcessSync: ProcessorFnSync<ValidationScope> = (context: ValidationContext) => {
    context.rules = context.rules || Rules;
    return validateProcessSync(context);
};

export const validateCustomProcessInfo: ProcessorInfo<ValidationContext, void> = {
    name: 'validateCustom',
    process: validateCustomProcess,
    processSync: validateCustomProcessSync,
    shouldProcess: shouldValidateCustom,
};

export const validateServerProcessInfo: ProcessorInfo<ValidationContext, void> = {
    name: 'validateServer',
    process: validateServerProcess,
    processSync: validateServerProcessSync,
    shouldProcess: shouldValidateServer,
};

export const validateProcessInfo: ProcessorInfo<ValidationContext, void> = {
    name: 'validate',
    process: validateAllProcess,
    processSync: validateAllProcessSync,
    shouldProcess: shouldValidateAll,
};

export * from './util';