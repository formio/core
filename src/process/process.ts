import * as _ from '@formio/lodash';

import { Component, ProcessType, ProcessorFn } from "types";
import { AsyncComponentDataCallback, eachComponentDataAsync } from "utils/formUtil";
import { validate } from './validation';
import { FieldError } from 'error';

type ProcessArgs = {
    components: Component[];
    data: Record<string, any>;
    before?: ProcessorFn[];
    after?: ProcessorFn[];
    process?: string;
}

export async function process({components, data, process, before = [], after = [] }: ProcessArgs) {
    const allErrors: FieldError[] = [];
    await eachComponentDataAsync(components, data, async(component, data, path, components) => {
        const componentErrors: FieldError[] = [];

        const beforeErrors = await before.reduce(async (promise, currFn) => {
            const acc = await promise;
            const newErrors = await currFn({ component, data, path, errors: componentErrors, processor: 'custom' });
            return [...acc, ...newErrors];
        }, Promise.resolve([] as FieldError[]));
        componentErrors.push(...beforeErrors);

        const validationErrors = await validate({
            component,
            data,
            path,
            process,
            processor: 'validate',
        });
        componentErrors.push(...validationErrors);

        const afterErrors = await after.reduce(async (promise, currFn) => {
            const acc = await promise;
            const newErrors = await currFn({ component, data, path, errors: componentErrors, processor: 'custom' });
            return [...acc, ...newErrors];
        }, Promise.resolve([] as FieldError[]));
        componentErrors.push(...afterErrors);


        allErrors.push(...componentErrors);
    }, '');
    return allErrors;
}
