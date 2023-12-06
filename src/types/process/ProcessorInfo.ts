export type ProcessCheckFn<ProcessorContext> = (context: ProcessorContext) => boolean;
export type ProcessorInfo<ProcessorContext, ProcessorReturnType> = {
    name: string;
    process?: (context: ProcessorContext) => Promise<ProcessorReturnType>;
    processSync?: (context: ProcessorContext) => ProcessorReturnType;
    shouldProcess: ProcessCheckFn<ProcessorContext>;
};