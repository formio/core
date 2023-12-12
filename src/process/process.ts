import { ProcessContext, ProcessContextSync, ProcessorScope } from "types";
import { eachComponentData, eachComponentDataAsync } from "utils/formUtil";
import { processOne, processOneSync } from './processOne';

export async function process<ProcessScope>(context: ProcessContext<ProcessScope>): Promise<ProcessScope> {
    const { instances, processors, components, data, scope, evalContext } = context;
    await eachComponentDataAsync(components, data, async (component, data, row, path, components, index) => {
        await processOne<ProcessScope>({
            component,
            components,
            processors,
            data,
            path,
            row,
            index,
            scope,
            instance: instances ? instances[path] : undefined,
            evalContext
        });
        if ((scope as ProcessorScope).noRecurse) {
            (scope as ProcessorScope).noRecurse = false;
            return true;
        }
    });
    return scope;
}

export function processSync<ProcessScope>(context: ProcessContextSync<ProcessScope>): ProcessScope {
    const { instances, processors, components, data, scope, evalContext } = context;
    eachComponentData(components, data, (component, data, row, path, components, index) => {
        processOneSync<ProcessScope>({
            component,
            components,
            processors,
            data,
            path,
            row,
            index,
            scope,
            instance: instances ? instances[path] : undefined,
            evalContext
        });
        if ((scope as ProcessorScope).noRecurse) {
            (scope as ProcessorScope).noRecurse = false;
            return true;
        }
    });
    return scope;
}
