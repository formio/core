import { Component, DataObject, PassedComponentInstance, ProcessorFn, ProcessorFnSync, ProcessType } from "types";

export type ComponentInstances = {
    [key: string]: PassedComponentInstance;
};

export type _ProcessContext<FunctionType, ProcessorScope> = {
    components: Component[];
    data: DataObject;
    processors: FunctionType[];
    scope: ProcessorScope;
    row?: DataObject;
    // TODO: woof, we have to type component instances
    instances?: ComponentInstances;
    process?: ProcessType;
}

export type ProcessContext<ProcessorScope> = _ProcessContext<ProcessorFn<ProcessorScope>, ProcessorScope>;
export type ProcessContextSync<ProcessorScope> = _ProcessContext<ProcessorFnSync<ProcessorScope>, ProcessorScope>;
