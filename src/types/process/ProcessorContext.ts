import { Component, DataObject, PassedComponentInstance, ProcessorScope, ProcessorType } from "types"
import { ProcessorFn, ProcessorFnSync } from "./ProcessorFn";
import { ProcessType } from "./ProcessType";

export type ProcessorContext<ProcessorScope> = {
    component: Component;
    path: string;
    data: DataObject;
    row: any;
    components?: Component[];
    instance?: PassedComponentInstance;
    process?: ProcessType;
    processor?: ProcessorType;
    config?: Record<string, any>;
    index?: number;
    scope: ProcessorScope;
    evalContext?: (context: ProcessorContext<ProcessorScope>) => any;
}

export type _ProcessorsContext<FunctionType> = {
    processors: FunctionType[];
}

export type ProcessorsContext<ProcessorScope> = ProcessorContext<ProcessorScope> & _ProcessorsContext<ProcessorFn<ProcessorScope>>;
export type ProcessorsContextSync<ProcessorScope> = ProcessorContext<ProcessorScope> & _ProcessorsContext<ProcessorFnSync<ProcessorScope>>;
