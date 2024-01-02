import { ProcessorsContext, ProcessorType } from "types";

export async function processOne<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
    const { processors } = context;
    context.processor = ProcessorType.Custom;
    for (const processor of processors) {
        if (processor?.process) {
            await processor.process(context);
        }
    }
}

export function processOneSync<ProcessorScope>(context: ProcessorsContext<ProcessorScope>) {
    const { processors } = context;
    context.processor = ProcessorType.Custom;
    processors.forEach((processor) => {
        if (processor?.processSync) {
            processor.processSync(context)
        }
    });
}
