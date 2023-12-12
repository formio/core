import { FilterContext, FilterScope, ProcessorFnSync } from "types";
import has from 'lodash/has';
import set from 'lodash/set';
import get from 'lodash/get';
export const filterProcessSync: ProcessorFnSync<FilterScope> = (context: FilterContext) => {
    const { component, row, scope } = context;
    if (has(row, component.key)) {
        set(scope.filtered, component.key, get(row, component.key));
    }
};

export const filterProcessInfo = {
    name: 'filter',
    processSync: filterProcessSync,
};