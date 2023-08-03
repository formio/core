import * as _ from '@formio/lodash';

import { ProcessContext, ProcessContextSync, ProcessorType } from "types";
import { eachComponentData, eachComponentDataAsync } from "utils/formUtil";
import { validate, validateSync } from './validation';
import { FieldError } from 'error';

export async function process({components, data, process, before = [], after = [] }: ProcessContext) {
    const allErrors: FieldError[] = [];
    await eachComponentDataAsync(components, data, async(component, data, path, components, index) => {
        const componentErrors: FieldError[] = [];

        const beforeErrors = await before.reduce(async (promise, currFn) => {
            const acc = await promise;
            const newErrors = await currFn({ component, data, path, index, errors: componentErrors, process, processor: ProcessorType.Custom });
            return [...acc, ...newErrors];
        }, Promise.resolve([] as FieldError[]));
        componentErrors.push(...beforeErrors);

        const validationErrors = await validate({
            component,
            data,
            path,
            index,
            process,
            processor: ProcessorType.Validate,
        });
        componentErrors.push(...validationErrors);

        const afterErrors = await after.reduce(async (promise, currFn) => {
            const acc = await promise;
            const newErrors = await currFn({ component, data, index, path, errors: componentErrors, processor: ProcessorType.Custom });
            return [...acc, ...newErrors];
        }, Promise.resolve([] as FieldError[]));
        componentErrors.push(...afterErrors);


        allErrors.push(...componentErrors);
    });
    return allErrors;
}

export function processSync({components, data, process, before = [], after = [] }: ProcessContextSync) {
    const allErrors: FieldError[] = [];
    eachComponentData(components, data, (component, data, path, components, index) => {
        const componentErrors: FieldError[] = [];

        const beforeErrors = before.reduce((acc, currFn) => {
            const newErrors = currFn({ component, data, path, index, errors: componentErrors, process, processor: ProcessorType.Custom });
            return [...acc, ...newErrors];
        }, [] as FieldError[]);
        componentErrors.push(...beforeErrors);

        const validationErrors = validateSync({
            component,
            data,
            path,
            index,
            process,
            processor: ProcessorType.Validate,
        });
        componentErrors.push(...validationErrors);

        const afterErrors = after.reduce((acc, currFn) => {
            const newErrors = currFn({ component, data, index, path, errors: componentErrors, processor: ProcessorType.Custom });
            return [...acc, ...newErrors];
        }, [] as FieldError[]);
        componentErrors.push(...afterErrors);


        allErrors.push(...componentErrors);
    });
    
    return allErrors;
}
