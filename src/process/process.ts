import { ProcessContext, ProcessContextSync, ProcessorScope } from "types";
import { eachComponentData, eachComponentDataAsync } from "utils/formUtil";
import { processOne, processOneSync } from './processOne';

export async function process<ProcessScope>(context: ProcessContext<ProcessScope>): Promise<ProcessScope> {
    const { instances, components, data, scope } = context;
    await eachComponentDataAsync(components, data, async (component, data, row, path, components, index) => {
        await processOne<ProcessScope>({...context, ...{
            component,
            path,
            row,
            index,
            instance: instances ? instances[path] : undefined
        }});
        if ((scope as ProcessorScope).noRecurse) {
            (scope as ProcessorScope).noRecurse = false;
            return true;
        }
    });
    return scope;
}

export function processSync<ProcessScope>(context: ProcessContextSync<ProcessScope>): ProcessScope {
    const { instances, components, data, scope } = context;
    eachComponentData(components, data, (component, data, row, path, components, index) => {
        processOneSync<ProcessScope>({...context, ...{
            component,
            path,
            row,
            index,
            instance: instances ? instances[path] : undefined
        }});
        if ((scope as ProcessorScope).noRecurse) {
            (scope as ProcessorScope).noRecurse = false;
            return true;
        }
    });
    return scope;
}
