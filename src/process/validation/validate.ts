import { Component, ComponentInstances, DataObject, ValidationRuleInfo, ValidationFn, ValidationFnSync, ValidationScope, ProcessContext, ProcessContextSync } from "types";
import { validateProcess, validateProcessSync } from "./validateProcess";
import { process, processSync } from "../process";
import { FieldError } from "error";

export type ProcessValidateContext = ProcessContext<ValidationScope> & {
    rules: ValidationRuleInfo[];
};

export type ProcessValidateContextSync = ProcessContextSync<ValidationScope> & {
    rules: ValidationRuleInfo[];
};

export async function processValidate(context: ProcessValidateContext): Promise<ValidationScope> {
    return await process<ValidationScope>(context);
}

export function processValidateSync(context: ProcessValidateContextSync): ValidationScope {
    return processSync<ValidationScope>(context);
}

export const validator = (rules: ValidationRuleInfo[]): ValidationFn => {
    return async (components: Component[], data: DataObject, instances?: ComponentInstances): Promise<FieldError[]> => {
        const scope: ValidationScope = await processValidate({
            components,
            data,
            instances,
            scope: {errors: []}, 
            processors: [validateProcess],
            rules,
        });
        return scope.errors;
    };
};

export const validatorSync = (rules: ValidationRuleInfo[]): ValidationFnSync => {
    return (components: Component[], data: DataObject, instances?: ComponentInstances): FieldError[] => {
        return processValidateSync({
            components,
            data, 
            instances, 
            scope: {errors: []}, 
            processors: [validateProcessSync],
            rules,
        }).errors;
    };
};