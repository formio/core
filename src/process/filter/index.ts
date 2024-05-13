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
                scope.filter[absolutePath] = {
                    compModelType: modelType,
                    include: true,
                    value: { data: {} }
                };
                break;
            case 'array':
                scope.filter[absolutePath] = {
                    compModelType: modelType,
                    include: true,
                };
                break;
            case 'object':
                if (component.type !== 'container') {
                    scope.filter[absolutePath] = {
                        compModelType: modelType,
                        include: true,
                    };
                }
                break;
            default:
                scope.filter[absolutePath] = {
                    compModelType: modelType,
                    include: true,
                };
                break;
        }
    }
};

export const filterProcess: ProcessorFn<FilterScope> = async (context: FilterContext) => {
    return filterProcessSync(context);
};

export const filterPostProcess: ProcessorFnSync<FilterScope> = (context: FilterContext) => {

    const { scope, submission } = context;
    console.log('filterPostProcess: context', Object.keys(context));
    console.dir(context.components)

    const filtered = {};
    for (const path in scope.filter) {
        console.log('filterPostProcess path:', path);
        const pathFilter = scope.filter[path];
        if (pathFilter) {

            let value = get(submission?.data, path) as any;
            console.log('path filter:', scope.filter[path]);
            console.log('path value:', value);


            // if (isObject(value) && isObject(scope.filter[path])) {
            //     if ((value as any).data) {
            //         value = { ...value, ...scope.filter[path], data: (value as any)?.data }
            //     } else {
            //         value = { ...value, ...scope.filter[path] }
            //     }
            // }

            if (pathFilter.compModelType !== 'dataObject') {
                set(filtered, path, value);
            }
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
