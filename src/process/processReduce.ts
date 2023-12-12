import { BaseProcessorContext, FilterScope, ProcessorInfo, ReducerScope } from "types";
import { Utils } from "utils";
import { filterProcessInfo } from "./filter";
import { validateProcessInfo } from "./validation";
import { calculateProcessInfo } from "./calculation";
import { conditionProcessInfo } from "./conditions";
import { defaultValueProcessInfo } from "./defaultValue";
import { fetchProcessInfo } from "./fetch";
import { processSync } from "./process";

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

// Perform a reduction on the processes to group the components by process types.
export function processReduce(context: BaseProcessorContext<ReducerScope>): ReducerScope {
    const { components, data, scope } = context;
    let filterScope: FilterScope = { filtered: {} };
    Utils.eachComponentData(components, data, (component, data, row, path, components, index) => {
        // Create a filter for submission data.
        filterProcessInfo.processSync({
            component, 
            data, 
            row, 
            path, 
            components, 
            index,
            scope: filterScope
        });

        // Create a reduced processor list of components to process.
        for (const processorName in ProcessorMap) {
            const processor: ProcessorInfo<any, any> = ProcessorMap[processorName];
            if (processor.shouldProcess({
                component,
                data,
                row,
                path,
                components,
                index,
                scope
            })) {
                if (!scope.processes.hasOwnProperty(processorName)) {
                    scope.processes[processorName] = [];
                }
                scope.processes[processorName].push({
                    ...component, 
                    ...{key: path}
                });
            }
        }
    });
    scope.data = filterScope.filtered;
    return scope;
}

// Process a reduced set of processes and components.
export function processReduced(context: BaseProcessorContext<ReducerScope>) {
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
                    data: scope.data,
                    scope: processScope
                });
            }
        }
    });
    return processScope;
}