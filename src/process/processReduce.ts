import { BaseProcessContext, FilterScope, ProcessComponents, ProcessComponentsTarget, ProcessorInfo, ProcessorsScope, ReducedProcessContext, ReducerScope } from "types";
import { Utils } from "utils";
import { filterProcessInfo } from "./filter";
import { validateServerProcessInfo } from "./validation/server";
import { validateCustomProcessInfo } from "./validation/evaluate";
import { calculateProcessInfo } from "./calculation";
import { conditionProcessInfo, customConditionalProcessInfo } from "./conditions";
import { customDefaultValueProcessInfo, defaultValueProcessInfo } from "./defaultValue";
import { fetchProcessInfo } from "./fetch";
import { processSync, process } from "./process";

// Export a record of all the supported processors.
export const ProcessorMap: Record<string, ProcessorInfo<any, any>> = {
    validate: validateServerProcessInfo,
    validateCustom: validateCustomProcessInfo,
    calculate: calculateProcessInfo,
    conditions: conditionProcessInfo,
    customConditions: customConditionalProcessInfo,
    defaultValue: defaultValueProcessInfo,
    customDefaultValue: customDefaultValueProcessInfo,
    fetch: fetchProcessInfo
};

export const ProcessorOrder: string[] = [
    'defaultValue',
    'customDefaultValue',
    'fetch',
    'calculate',
    'conditions',
    'customConditions',
    'validate',
    'validateCustom',
];

export const ServerProcessors: string[] = [
    'defaultValue',
    'fetch',
    'validate',
    'conditions'
];

// Perform a reduction on the processes to group the components by process types.
export function processReduce(context: BaseProcessContext<ReducerScope>): ReducerScope {
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
                    ...{path}
                });
            }
        }
    });
    scope.data = filterScope.filtered;
    return scope;
}

// Process a reduced set of processes and components.
export function processReducedSync(context: ReducedProcessContext<ProcessorsScope>) {
    const { scope, processes } = context;
    ProcessorOrder.forEach((processorName: string) => {
        if (processes.hasOwnProperty(processorName) && ProcessorMap.hasOwnProperty(processorName)) {
            const processor: ProcessorInfo<any, any> = ProcessorMap[processorName];
            if (processor.processSync) {
                processSync({...context, ...{
                    processors: [processor.processSync],
                    components: processes[processorName],
                }});
            }
        }
    });
    return scope;
}

// Asynchronoously process a reduced set of processes and components.
export async function processReduced(context: ReducedProcessContext<ProcessorsScope>) {
    const { scope, processes } = context;
    for (const processorName of ProcessorOrder) {
        if (processes.hasOwnProperty(processorName) && ProcessorMap.hasOwnProperty(processorName)) {
            const processor: ProcessorInfo<any, any> = ProcessorMap[processorName];
            if (processor.process) {
                await process({...context, ...{
                    processors: [processor.process],
                    components: processes[processorName],
                }});
            }
        }
    }
    return scope;
}

/**
 * Provided a set of processes, this will group them by target and the processors by server or custom.
 * 
 * For example:
 */
export function processReduceTargets(processes: ProcessComponents): ProcessComponentsTarget[] {
    const processTargets: ProcessComponentsTarget[] = [];
    ProcessorOrder.forEach((processorName: string) => {
        if (processes.hasOwnProperty(processorName) && ProcessorMap.hasOwnProperty(processorName)) {
            let previousTarget = processTargets[processTargets.length - 1];
            const newTarget = ServerProcessors.includes(processorName) ? 'server' : 'custom';
            if (!previousTarget || newTarget !== previousTarget.target) {
                previousTarget = {target: newTarget, processes: {}};
                processTargets.push(previousTarget);
            }
            previousTarget.processes[processorName] = processes[processorName];
        }
    });
    return processTargets;
}