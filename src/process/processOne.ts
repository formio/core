import { ProcessorsContext, ProcessorsContextSync, ProcessorType } from "types";

export async function processOne<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
    const { processors } = context;
    context.processor = ProcessorType.Custom;
    for (const processor of processors) {
        await processor(context);
    }
}

export function processOneSync<ProcessorScope>(context: ProcessorsContextSync<ProcessorScope>) {
    const { processors } = context;
    context.processor = ProcessorType.Custom;
    processors.forEach((processor) => processor(context));
}
