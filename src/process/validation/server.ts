import { Component, ComponentInstances, DataObject, ProcessorFn, ProcessorFnSync, ProcessorInfo, ValidationContext, ValidationScope } from "types";
import { ServerRules } from "./rules";
import { FieldError } from "error";
import { validator, validatorSync } from "./validate";
import { validateProcess, validateProcessSync } from "./validateProcess";
import { shouldValidateCustom } from './evaluate'

// Perform a validation on a form asynchonously.
export async function validate(components: Component[], data: DataObject, instances?: ComponentInstances): Promise<FieldError[]> {
    return validator(ServerRules)(components, data, instances);
}

// Perform a validation on a form synchronously.
export function validateSync(components: Component[], data: DataObject, instances?: ComponentInstances): FieldError[] {
    return validatorSync(ServerRules)(components, data, instances);
}

export const validateServerProcess: ProcessorFn<ValidationScope> = async (context: ValidationContext) => {
    context.rules = ServerRules;
    return validateProcess(context);
};

export const validateServerProcessSync: ProcessorFnSync<ValidationScope> = (context: ValidationContext) => {
    context.rules = ServerRules;
    return validateProcessSync(context);
};

export const validateServerProcessInfo: ProcessorInfo<ValidationContext, void> = {
    name: 'validateServer',
    process: validateServerProcess,
    processSync: validateServerProcessSync,
    shouldProcess: (context: ValidationContext) => !shouldValidateCustom(context)
};

export * from './util';