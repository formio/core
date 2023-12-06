import { Component, ComponentInstances, DataObject, ValidationRuleInfo, ValidationFn, ValidationFnSync, ValidationScope } from "types";
import { validateProcess, validateProcessSync } from "./validateProcess";
import { process, processSync } from "../process";
import { FieldError } from "error";
export const validator = (rules: ValidationRuleInfo[]): ValidationFn => {
    return async (components: Component[], data: DataObject, instances?: ComponentInstances): Promise<FieldError[]> => {
        const scope: ValidationScope = await process<ValidationScope>({
            components,
            data,
            instances,
            scope: {errors: [], rules}, 
            processors: [validateProcess]
        });
        return scope.errors;
    };
};

export const validatorSync = (rules: ValidationRuleInfo[]): ValidationFnSync => {
    return (components: Component[], data: DataObject, instances?: ComponentInstances): FieldError[] => {
        return processSync<ValidationScope>({
            components,
            data, 
            instances, 
            scope: {errors: [], rules}, 
            processors: [validateProcessSync]
        }).errors;
    };
};