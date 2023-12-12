import { Component, DataObject, PassedComponentInstance, ProcessorContext, ProcessorFn, ProcessorFnSync, ProcessType } from "types";

export type ComponentInstances = {
    [key: string]: PassedComponentInstance;
};

export type BaseProcessorContext<ProcessorScope> = {
    components: Component[];
    data: DataObject;
    scope: ProcessorScope;
    row?: DataObject;
    instances?: ComponentInstances;
    process?: ProcessType;
    form?: any;
    submission?: any;
    evalContext?: (context: ProcessorContext<ProcessorScope>) => any;
}

export type _ProcessContext<FunctionType, ProcessorScope> = BaseProcessorContext<ProcessorScope> & {
    processors: FunctionType[];
}

export type ProcessContext<ProcessorScope> = _ProcessContext<ProcessorFn<ProcessorScope>, ProcessorScope>;
export type ProcessContextSync<ProcessorScope> = _ProcessContext<ProcessorFnSync<ProcessorScope>, ProcessorScope>;