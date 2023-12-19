import { Component, ComponentInstances, DataObject, ProcessorFn, ProcessorFnSync, ProcessorInfo, ValidationContext, ValidationScope } from "types";
import { Rules } from "./rules";
import { FieldError } from "error";
import { validator, validatorSync } from "./validate";
import { validateProcess, validateProcessSync } from "./validateProcess";
import { shouldValidate } from "./util";

// Perform a validation on a form asynchonously.
export async function validate(components: Component[], data: DataObject, instances?: ComponentInstances): Promise<FieldError[]> {
    return validator(Rules)(components, data, instances);
}

// Perform a validation on a form synchronously.
export function validateSync(components: Component[], data: DataObject, instances?: ComponentInstances): FieldError[] {
    return validatorSync(Rules)(components, data, instances);
}

export const validateAllProcess: ProcessorFn<ValidationScope> = async (context: ValidationContext) => {
    context.rules = Rules;
    return validateProcess(context);
};

export const validateAllProcessSync: ProcessorFnSync<ValidationScope> = (context: ValidationContext) => {
    context.rules = Rules;
    return validateProcessSync(context);
};

export const validateProcessInfo: ProcessorInfo<ValidationContext, void> = {
    name: 'validate',
    process: validateAllProcess,
    processSync: validateAllProcessSync,
    shouldProcess: shouldValidate,
};

export * from './util';
export * from './validateProcess';