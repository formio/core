import * as _ from '@formio/lodash';

import { ProcessOneContext, ProcessorType } from "types";
import { validate } from './validation';
import { FieldError } from 'error';

export async function processOne({component, path, data, process, before = [], after = [] }: ProcessOneContext) {
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
    return componentErrors;
}
