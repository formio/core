import { ProcessorsContext, ProcessorsContextSync, ProcessorType } from "types";

export async function processOne<ProcessorScope>({component, components, path, data, row, process, instance, processors, index, scope}: ProcessorsContext<ProcessorScope>) {
    for (const processor of processors) {
        await processor({
            component,
            components,
            instance,
            data,
            path,
            scope,
            index,
            row,
            process,
            processor: ProcessorType.Custom
        });
    }
}

export function processOneSync<ProcessorScope>({component, components, path, data, row, process, instance, processors, index, scope}: ProcessorsContextSync<ProcessorScope>) {
    processors.forEach((processor) => processor({
        component,
        components,
        instance,
        data,
        path,
        scope,
        index,
        row,
        process,
        processor: ProcessorType.Custom
    }));
}
