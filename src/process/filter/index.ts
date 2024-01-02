import { FilterContext, FilterScope, ProcessorFn, ProcessorFnSync, ProcessorInfo } from "types";
import set from 'lodash/set';
import { Utils } from "utils";
export const filterProcessSync: ProcessorFnSync<FilterScope> = (context: FilterContext) => {
    const { scope, value, path, component } = context;
    if (!scope.filtered) scope.filtered = {};
    if (value !== undefined) {
        const modelType = Utils.getModelType(component);
        switch (modelType) {
            case 'dataObject':
                set(scope.filtered, path, {...value, data: {}});
                break;
            case 'object':
                if (component.type === 'container') {
                    set(scope.filtered, path, {});
                }
                else {
                    set(scope.filtered, path, value);
                }
                break;
            case 'array':
                set(scope.filtered, path, []);
                break;
            default:
                // Make sure to set the value as an array if the component is a multi-value component.
                if (component.multiple && value && !Array.isArray(value)) {
                    set(scope.filtered, path, [value]);
                    break;
                }
                set(scope.filtered, path, value);
                break;
        }
    }
};

export const filterProcess: ProcessorFn<FilterScope> = async (context: FilterContext) => {
    return filterProcessSync(context);
};

export const filterPostProcess: ProcessorFnSync<FilterScope> = (context: FilterContext) => {
    context.data = context.scope.filtered ? context.scope.filtered : {};
};

export const filterProcessInfo: ProcessorInfo<FilterContext, void> = {
    name: 'filter',
    process: filterProcess,
    processSync: filterProcessSync,
    postProcess: filterPostProcess,
    shouldProcess: (context: FilterContext) => true,
};