import * as _ from '@formio/lodash';

import { ProcessOneContext, ProcessOneContextSync, ProcessorType } from "types";
import { FieldError } from 'error';
import { validateSync, validate } from './validation';


export async function processOne({component, path, data, process, evalContext = {}, before = [], after = []}: ProcessOneContext) {
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
        evalContext,
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

export function processOneSync({component, path, data, process, evalContext = {}, before = [], after = [] }: ProcessOneContextSync) {
    const componentErrors: FieldError[] = [];

    const beforeErrors = before.reduce((acc, currFn) => {
        const newErrors = currFn({ component, data, path, errors: componentErrors, process, processor: ProcessorType.Custom });
        return [...acc, ...newErrors];
    }, [] as FieldError[]);
    componentErrors.push(...beforeErrors);

    const validationErrors = validateSync({
        component,
        data,
        evalContext,
        path,
        process,
        processor: ProcessorType.Validate,
    });
    componentErrors.push(...validationErrors);

    const afterErrors = after.reduce((acc, currFn) => {
        const newErrors = currFn({ component, data, path, errors: componentErrors, processor: ProcessorType.Custom });
        return [...acc, ...newErrors];
    }, [] as FieldError[]);
    componentErrors.push(...afterErrors);
    return componentErrors;
}
