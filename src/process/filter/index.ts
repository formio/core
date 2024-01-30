import { FilterContext, FilterScope, ProcessorFn, ProcessorFnSync, ProcessorInfo } from "types";
import set from 'lodash/set';
import { Utils } from "utils";
import { get, isObject } from "lodash";
export const filterProcessSync: ProcessorFnSync<FilterScope> = (context: FilterContext) => {
    const { scope, value, path, component, data } = context;
    if (!scope.filter) scope.filter = {};
    if (value !== undefined) {
        const modelType = Utils.getModelType(component);
        switch (modelType) {
            case 'dataObject':
                scope.filter[path] = {data: {}};
                break;
            case 'array':
                break;
            case 'object':
                if (component.type !== 'container') {
                    scope.filter[path] = true;
                }
                break;
            default:
                // Make sure to set the value as an array if the component is a multi-value component.
                if (component.multiple && value && !Array.isArray(value)) {
                    set(data, path, [value]);
                }
                scope.filter[path] = true;
                break;
        }
    }
};

export const filterProcess: ProcessorFn<FilterScope> = async (context: FilterContext) => {
    return filterProcessSync(context);
};

export const filterPostProcess: ProcessorFnSync<FilterScope> = (context: FilterContext) => {
    const { scope, data } = context;
    const filtered = {};
    for (const path in scope.filter) {
        if (scope.filter[path]) {
            let value = get(data, path);
            if (isObject(value) && isObject(scope.filter[path])) {
                value = {...value, ...scope.filter[path]}
            }
            set(filtered, path, value);
        }
    }
    context.data = filtered;
};

export const filterProcessInfo: ProcessorInfo<FilterContext, void> = {
    name: 'filter',
    process: filterProcess,
    processSync: filterProcessSync,
    postProcess: filterPostProcess,
    shouldProcess: (context: FilterContext) => true,
};