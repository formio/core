import { ProcessContext, ProcessContextSync, ProcessorInfo, ProcessorScope, ReducerScope } from "types";
import { eachComponentData, eachComponentDataAsync } from "utils/formUtil";
import { processOne, processOneSync } from './processOne';
import { validateProcessInfo } from "./validation";
import { calculateProcessInfo } from "./calculation";
import { conditionProcessInfo } from "./conditions";
import { defaultValueProcessInfo } from "./defaultValue";
import { fetchProcessInfo } from "./fetch";
import { filterProcessInfo } from "./filter";

// Export a record of all the supported processors.
export const ProcessorMap: Record<string, ProcessorInfo<any, any>> = {
    validate: validateProcessInfo,
    calculate: calculateProcessInfo,
    conditions: conditionProcessInfo,
    defaultValue: defaultValueProcessInfo,
    fetch: fetchProcessInfo
};

export const ProcessorOrder: string[] = [
    'defaultValue',
    'fetch',
    'calculate',
    'conditions',
    'validate'
];

export async function process<ProcessScope>(context: ProcessContext<ProcessScope>): Promise<ProcessScope> {
    const { instances, processors, components, data, row, scope, evalContext } = context;
    await eachComponentDataAsync(components, data, row || data, async (component, data, row, path, components, index) => {
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
    const { instances, processors, components, data, row, scope, evalContext } = context;
    eachComponentData(components, data, row || data, (component, data, row, path, components, index) => {
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

// Perform a reduction on the processes to group the components by process types.
export function processReduce(context: ProcessContext<ReducerScope>): ReducerScope {
    const { components, data, row, scope } = context;
    scope.filtered = {};
    scope.processes = {};
    eachComponentData(components, data, row || data, (component, data, row, path, components, index) => {
        // Create a filter for submission data.
        filterProcessInfo.processSync({component, data, row, path, components, index, scope});

        // Create a reduced processor list of components to process.
        for (const processorName in ProcessorMap) {
            const processor: ProcessorInfo<any, any> = ProcessorMap[processorName];
            if (processor.shouldProcess({component, data, row, path, components, index, scope})) {
                if (!scope.processes.hasOwnProperty(processorName)) {
                    scope.processes[processorName] = [];
                }
                scope.processes[processorName].push(component);
            }
        }
    });
    return scope;
}

// Process a reduced set of processes and components.
export function processReduced(context: ProcessContext<ReducerScope>) {
    const { scope } = context;
    const processes = scope.processes;
    const processScope = {
        errors: []
    };
    ProcessorOrder.forEach((processorName: string) => {
        if (processes.hasOwnProperty(processorName) && ProcessorMap.hasOwnProperty(processorName)) {
            const processor: ProcessorInfo<any, any> = ProcessorMap[processorName];
            if (processor.processSync) {
                processSync({
                    processors: [processor.processSync],
                    components: processes[processorName],
                    data: scope.filtered,
                    scope: processScope
                });
            }
        }
    });
    return processScope;
}