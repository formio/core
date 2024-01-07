import { ProcessContext, ProcessTarget, ProcessorInfo, ProcessorScope } from "types";
import { eachComponentData, eachComponentDataAsync } from "utils/formUtil";
import { processOne, processOneSync } from './processOne';
import { defaultValueProcessInfo, serverDefaultValueProcessInfo, customDefaultValueProcessInfo } from "./defaultValue";
import { fetchProcessInfo } from "./fetch";
import { calculateProcessInfo } from "./calculation";
import { logicProcessInfo } from "./logic";
import { conditionProcessInfo, customConditionProcessInfo, simpleConditionProcessInfo } from "./conditions";
import { validateCustomProcessInfo, validateProcessInfo, validateServerProcessInfo } from "./validation";
import { filterProcessInfo } from "./filter";

export async function process<ProcessScope>(context: ProcessContext<ProcessScope>): Promise<ProcessScope> {
    const { instances, components, data, scope, flat, processors } = context;
    await eachComponentDataAsync(components, data, async (component, data, row, path, components, index) => {
        await processOne<ProcessScope>({...context, ...{
            component,
            components,
            path,
            row,
            index,
            instance: instances ? instances[path] : undefined
        }});
        if (flat) {
            return true;
        }
        if ((scope as ProcessorScope).noRecurse) {
            (scope as ProcessorScope).noRecurse = false;
            return true;
        }
    });
    for (let i = 0; i < processors?.length; i++) {
        const processor = processors[i];
        if (processor.postProcess) {
            processor.postProcess(context);
        }
    }
    return scope;
}

export function processSync<ProcessScope>(context: ProcessContext<ProcessScope>): ProcessScope {
    const { instances, components, data, scope, flat, processors } = context;
    eachComponentData(components, data, (component, data, row, path, components, index) => {
        processOneSync<ProcessScope>({...context, ...{
            component,
            components,
            path,
            row,
            index,
            instance: instances ? instances[path] : undefined
        }});
        if (flat) {
            return true;
        }
        if ((scope as ProcessorScope).noRecurse) {
            (scope as ProcessorScope).noRecurse = false;
            return true;
        }
    });
    for (let i = 0; i < processors?.length; i++) {
        const processor = processors[i];
        if (processor.postProcess) {
            processor.postProcess(context);
        }
    }
    return scope;
}

// Export a record of all the supported processors.
export const ProcessorMap: Record<string, ProcessorInfo<any, any>> = {
    filter: filterProcessInfo,
    defaultValue: defaultValueProcessInfo,
    serverDefaultValue: serverDefaultValueProcessInfo,
    customDefaultValue: customDefaultValueProcessInfo,
    calculate: calculateProcessInfo,
    conditions: conditionProcessInfo,
    customConditions: customConditionProcessInfo,
    simpleConditions: simpleConditionProcessInfo,
    fetch: fetchProcessInfo,
    logic: logicProcessInfo,
    validate: validateProcessInfo,
    validateCustom: validateCustomProcessInfo,
    validateServer: validateServerProcessInfo
};

export const ProcessTargets: ProcessTarget = {
    server: [
        filterProcessInfo,
        serverDefaultValueProcessInfo,
        fetchProcessInfo,
        simpleConditionProcessInfo,
        validateServerProcessInfo
    ],
    evaluator: [
        customDefaultValueProcessInfo,
        calculateProcessInfo,
        logicProcessInfo,
        conditionProcessInfo,
        validateProcessInfo
    ]
};
