import { Component, ComponentInstances, DataObject, ProcessorFn, ProcessorFnSync, ProcessorInfo, ValidationContext, ValidationScope } from "types";
import { ClientRules } from "./rules/clientRules";
import { FieldError } from "error";
import { validator, validatorSync } from "./validate";
import { validateProcess, validateProcessSync } from "./validateProcess";
import { shouldValidate } from "./util";

// Perform a validation on a form asynchonously.
export async function validate(components: Component[], data: DataObject, instances?: ComponentInstances): Promise<FieldError[]> {
    return validator(ClientRules)(components, data, instances);
}

// Perform a validation on a form synchronously.
export function validateSync(components: Component[], data: DataObject, instances?: ComponentInstances): FieldError[] {
    return validatorSync(ClientRules)(components, data, instances);
}

export const validateClientProcess: ProcessorFn<ValidationScope> = async (context: ValidationContext) => {
    context.rules = ClientRules;
    return validateProcess(context);
};

export const validateClientProcessSync: ProcessorFnSync<ValidationScope> = (context: ValidationContext) => {
    context.rules = ClientRules;
    return validateProcessSync(context);
};

export const validateClientProcessInfo: ProcessorInfo<ValidationContext, void> = {
    name: 'validateClient',
    process: validateClientProcess,
    processSync: validateClientProcessSync,
    shouldProcess: shouldValidate,
};

export * from './util';