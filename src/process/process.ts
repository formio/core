import * as _ from '@formio/lodash';

import { Component, ProcessType, ProcessorFn, ProcessorType } from "types";
import { eachComponentDataAsync } from "utils";
import { validate } from './validation';
import { FieldError } from 'error';

type ProcessArgs = {
    components: Component[];
    data: Record<string, any>;
    process: ProcessType;
    before?: ProcessorFn[];
    after?: ProcessorFn[];
}

export async function process({components, data, process, before = [], after = []}: ProcessArgs) {
    const errors: FieldError[] = [];
    switch (process) {
        case ProcessType.Submit: {
            await eachComponentDataAsync(components, data, async(component, data, path) => {
                const beforeErrors = await before.reduce(async (promise, fn) => {
                    const acc = await promise;
                    const newErrors = await fn({ component, data, path, processor: ProcessorType.Custom });
                    return [...acc, ...newErrors];
                }, Promise.resolve([] as FieldError[]));
                errors.push(...beforeErrors);

                // TODO: to keep this backwards compatible (for now), we need to handle `multiple` components here because
                // the DOM manipulation pipeline (i.e. component.setComponentValidity() etc.) expects a group of messages per component
                // (rather than one message per constituent input if we were to handle this in eachComponentDataAsync); we need
                // to fix the DOM manipulation pipeline to allow for the new paradigm of drilling down to each constituent component,
                // at which point this will get a LOT cleaner
                if (component.multiple) {
                    const contextualData = _.get(data, path);
                    if (contextualData.length > 0) {
                        const componentErrors = [];
                        for (let index = 0; index < _.get(data, path).length; index++) {
                            const amendedPath = `${path}[${index}]`;
                            const newErrors = await validate({
                                component,
                                data,
                                path: amendedPath,
                                processor: ProcessorType.Validator,
                                process: ProcessType.Submit
                            });
                            componentErrors.push(...newErrors);
                        }
                        errors.push(...componentErrors);
                        return;
                    }
                }
                const validationErrors = await validate({
                    component,
                    data,
                    path,
                    process,
                    processor: ProcessorType.Validator,
                });
                errors.push(...validationErrors);

                // add other processors here...

                const afterErrors = await after.reduce(async (promise, fn) => {
                    const acc = await promise;
                    const newErrors = await fn({ component, data, path, processor: ProcessorType.Custom });
                    return [...acc, ...newErrors];
                }, Promise.resolve([] as FieldError[]));
                errors.push(...afterErrors);
            });
        }
        default:
            break;
    }
    return errors;
}
