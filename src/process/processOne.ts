import { get } from "lodash";
import { Component, DataObject, ProcessorsContext, ProcessorType } from "types";
import { getComponentKey } from "utils/formUtil";

export function dataValue(component: Component, row: any) {
    const key = getComponentKey(component);
    return key ? get(row, key) : undefined;
}

export async function processOne<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
    if (!context.row) {
        return;
    }
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
    const { processors, component } = context;
    // Check if the component is in a nested form
    let parent: any = component?.parent;
    while (parent?.type !== "form" && parent !== undefined && parent !== null) {
        parent = parent?.parent;
    }
    // If the component is in a nested form, set the context data to the parent form data
    if (parent?.type === "form") {
        const dataPath = component.path?.replace(`.${component.key}`, '');
        const data = get(context.data, dataPath ?? '');
        context.data = data as DataObject;
    }
    context.processor = ProcessorType.Custom;
    context.value = dataValue(context.component, context.row);
    processors.forEach((processor) => {
        if (processor?.processSync) {
            processor.processSync(context)
        }
    });
}
