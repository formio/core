import { unset } from 'lodash';
import {
    ProcessorScope,
    ProcessorContext,
    ProcessorInfo,
    ProcessorFnSync,
    ConditionsScope
} from "types";

type ClearHiddenScope = ProcessorScope & {
    clearHidden: {
        [path: string]: boolean;
    }
}

/**
 * This processor function checks components for the `hidden` property and unsets corresponding data
 */
export const clearHiddenProcess: ProcessorFnSync<ClearHiddenScope> = (context) => {
    const { component, data, path, value, scope } = context;
    if (!scope.clearHidden) {
        scope.clearHidden = {};
    }
    //conditional path is a partial path, check to see if in the path
    const conditionallyHidden = (scope as ConditionsScope).conditionals?.find((cond) => {
        return path.includes(cond.path);
    });
    if (
        conditionallyHidden?.conditionallyHidden &&
        (value !== undefined) &&
        (!component.hasOwnProperty('clearOnHide') || component.clearOnHide)
    ) {
        unset(data, path);
        scope.clearHidden[path] = true;
    }
}

export const clearHiddenProcessInfo: ProcessorInfo<ProcessorContext<ClearHiddenScope>, void> = {
    name: 'clearHidden',
    shouldProcess: () => true,
    processSync: clearHiddenProcess,
}
