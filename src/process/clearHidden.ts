import unset from 'lodash/unset';
import {
    ProcessorScope,
    ProcessorContext,
    ProcessorInfo,
    ProcessorFnSync
} from "types";

/**
 * This processor function checks components for the `hidden` property and unsets corresponding data
 */
export const clearHiddenProcess: ProcessorFnSync<ProcessorScope> = (context) => {
    const { component, data, path, value } = context;
    if (component.hidden && value !== undefined && (!component.hasOwnProperty('clearOnHide') || component.clearOnHide)) {
        unset(data, path);
    }
}

export const clearHiddenProcessInfo: ProcessorInfo<ProcessorContext<ProcessorScope>, void> = {
    name: 'clearHidden',
    shouldProcess: () => true,
    processSync: clearHiddenProcess,
}
