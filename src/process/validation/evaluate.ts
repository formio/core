import { Component, ComponentInstances, DataObject, ProcessorFn, ProcessorFnSync, ProcessorInfo, ValidationContext, ValidationRuleInfo, ValidationScope } from "types";
import { EvaluationRules } from "./rules/evaluationRules";
import { FieldError } from "error";
import { validator, validatorSync } from "./validate";
import { validateProcess, validateProcessSync } from "./validateProcess";
import { shouldValidate } from "./util";

export function shouldValidateCustom(context: ValidationContext): boolean {
    return shouldValidate(context) && EvaluationRules.reduce((acc, rule: ValidationRuleInfo) => {
        return acc && rule.shouldProcess(context);
    }, true);
}

// Perform a validation on a form asynchonously.
export async function validate(components: Component[], data: DataObject, instances?: ComponentInstances): Promise<FieldError[]> {
    return validator(EvaluationRules)(components, data, instances);
}

// Perform a validation on a form synchronously.
export function validateSync(components: Component[], data: DataObject, instances?: ComponentInstances): FieldError[] {
    return validatorSync(EvaluationRules)(components, data, instances);
}

export const validateCustomProcess: ProcessorFn<ValidationScope> = async (context: ValidationContext) => {
    context.rules = EvaluationRules;
    return validateProcess(context);
};

export const validateCustomProcessSync: ProcessorFnSync<ValidationScope> = (context: ValidationContext) => {
    context.rules = EvaluationRules;
    return validateProcessSync(context);
};

export const validateCustomProcessInfo: ProcessorInfo<ValidationContext, void> = {
    name: 'validateCustom',
    process: validateCustomProcess,
    processSync: validateCustomProcessSync,
    shouldProcess: shouldValidateCustom,
};

export * from './util';