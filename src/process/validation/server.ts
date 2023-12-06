import { Component, ComponentInstances, DataObject, ProcessorFn, ProcessorFnSync, ProcessorInfo, ValidationContext, ValidationScope } from "types";
import { ServerRules } from "./rules";
import { FieldError } from "error";
import { validator, validatorSync } from "./validate";
import { shouldValidate } from "./util";
import { validateProcess, validateProcessSync } from "./validateProcess";

// Perform a validation on a form asynchonously.
export async function validate(components: Component[], data: DataObject, instances?: ComponentInstances): Promise<FieldError[]> {
    return validator(ServerRules)(components, data, instances);
}

// Perform a validation on a form synchronously.
export function validateSync(components: Component[], data: DataObject, instances?: ComponentInstances): FieldError[] {
    return validatorSync(ServerRules)(components, data, instances);
}

export const validateServerProcess: ProcessorFn<ValidationScope> = async (context: ValidationContext) => {
    context.scope.rules = ServerRules;
    return validateProcess(context);
};

export const validateServerProcessSync: ProcessorFnSync<ValidationScope> = (context: ValidationContext) => {
    context.scope.rules = ServerRules;
    return validateProcessSync(context);
};

export const validateServerProcessInfo: ProcessorInfo<ValidationContext, void> = {
    name: 'validateServer',
    process: validateServerProcess,
    processSync: validateServerProcessSync,
    shouldProcess: shouldValidate,
};

export * from './util';