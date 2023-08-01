import * as _ from '@formio/lodash';

import { ProcessOneContext, ProcessorType } from "types";
import { FieldError } from 'error';
import { validateSync } from './validation';

export function processOne({component, path, data, process, evalContext = {}, before = [], after = [] }: ProcessOneContext) {
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
