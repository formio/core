import { FilterContext, FilterScope, ProcessorFn, ProcessorFnSync, ProcessorInfo } from "types";
import set from 'lodash/set';
import { Utils } from "utils";
import { get, isObject } from "lodash";
import { getComponentAbsolutePath } from "utils/formUtil";
export const filterProcessSync: ProcessorFnSync<FilterScope> = (context: FilterContext) => {
    const { scope, component } = context;
    let { value } = context;
    const absolutePath = getComponentAbsolutePath(component);
    if (!scope.filter) scope.filter = {};
    if (value !== undefined) {
        const modelType = Utils.getModelType(component);
        switch (modelType) {
            case 'dataObject':
                scope.filter[absolutePath] = {data: {}};
                break;
            case 'array':
                break;
            case 'object':
                if (component.type !== 'container') {
                    scope.filter[absolutePath] = true;
                }
                break;
            default:
                scope.filter[absolutePath] = true;
                break;
        }
    }
};

export const filterProcess: ProcessorFn<FilterScope> = async (context: FilterContext) => {
    return filterProcessSync(context);
};

export const filterPostProcess: ProcessorFnSync<FilterScope> = (context: FilterContext) => {
    const { scope, submission } = context;
    const filtered = {};
    for (const path in scope.filter) {
        if (scope.filter[path]) {
            let value = get(submission?.data, path);
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
