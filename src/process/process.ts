import * as _ from '@formio/lodash';

import { ProcessContext, ProcessorType } from "types";
import { eachComponentDataAsync } from "utils/formUtil";
import { validate } from './validation';
import { FieldError } from 'error';

export async function process({components, data, process, before = [], after = [] }: ProcessContext) {
    const allErrors: FieldError[] = [];
    await eachComponentDataAsync(components, data, async(component, data, path) => {
        const componentErrors: FieldError[] = [];

        const beforeErrors = await before.reduce(async (promise, currFn) => {
            const acc = await promise;
            const newErrors = await currFn({ component, data, path, errors: componentErrors, process, processor: ProcessorType.Custom });
            return [...acc, ...newErrors];
        }, Promise.resolve([] as FieldError[]));
        componentErrors.push(...beforeErrors);

        const validationErrors = await validate({
            component,
            data,
            path,
            process,
            processor: ProcessorType.Validate,
        });
        componentErrors.push(...validationErrors);

        const afterErrors = await after.reduce(async (promise, currFn) => {
            const acc = await promise;
            const newErrors = await currFn({ component, data, path, errors: componentErrors, processor: ProcessorType.Custom });
            return [...acc, ...newErrors];
        }, Promise.resolve([] as FieldError[]));
        componentErrors.push(...afterErrors);


        allErrors.push(...componentErrors);
    });
    return allErrors;
}
