import { Component, ComponentInstances, DataObject, ProcessContext, ProcessContextSync, ValidationScope } from 'types';
import { process, processSync } from './process';
import { validateProcess, validateProcessSync } from './validation';
import { FieldError } from 'error';

// Perform a validation on a form asynchonously.
export async function validate(components: Component[], data: DataObject, instances?: ComponentInstances): Promise<FieldError[]> {
    const scope: ValidationScope = await process<ValidationScope>({
        components,
        data,
        instances,
        scope: {errors: []}, 
        processors: [validateProcess]
    });
    return scope.errors;
}

// Perform a validation on a form synchronously.
export function validateSync(components: Component[], data: DataObject, instances?: ComponentInstances): FieldError[] {
    return processSync<ValidationScope>({
        components,
        data, 
        instances, 
        scope: {errors: []}, 
        processors: [validateProcessSync]
    }).errors;
}

export * from './validation';
export { processOne, processOneSync } from './processOne';
export { process, processSync };
