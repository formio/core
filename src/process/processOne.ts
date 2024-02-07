import { get } from "lodash";
import { Component, ProcessorsContext, ProcessorType } from "types";
import { getComponentKey } from "utils/formUtil";

export function dataValue(component: Component, row: any) {
    const key = getComponentKey(component);
    return key ? get(row, key) : undefined;
}

export async function processOne<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
    const { processors } = context;
    context.processor = ProcessorType.Custom;
    context.value = dataValue(context.component, context.row);
    for (const processor of processors) {
        if (processor?.process) {
            await processor.process(context);
        }
    }
}

export function processOneSync<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
    const { processors } = context;
    context.processor = ProcessorType.Custom;
    context.value = dataValue(context.component, context.row);
    processors.forEach((processor) => {
        if (processor?.processSync) {
            processor.processSync(context)
        }
    });
}
