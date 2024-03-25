import get from 'lodash/get';
import { ProcessorContext, ProcessorScope, Component } from 'types';
export const generateProcessorContext = (component: Component, data: any): ProcessorContext<ProcessorScope> => {
    return {
        component,
        path: component.key,
        data,
        row: data,
        scope: {} as ProcessorScope,
        value: get(data, component.key),
    }
}
