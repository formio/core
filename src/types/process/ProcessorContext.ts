import { Component, DataObject, Form, PassedComponentInstance, ProcessorInfo, ProcessorScope, ProcessorType, Submission } from "types"
import { ProcessorFn, ProcessorFnSync } from "./ProcessorFn";
import { ProcessType } from "./ProcessType";

export type ProcessorContext<ProcessorScope> = {
    component: Component;
    path: string;
    data: DataObject;
    row: any;
    value?: any;
    form?: Form;
    submission?: Submission;
    components?: Component[];
    instance?: PassedComponentInstance;
    process?: ProcessType;
    processor?: ProcessorType;
    config?: Record<string, any>;
    index?: number;
    scope: ProcessorScope;
    evalContext?: (context: ProcessorContext<ProcessorScope>) => any;
}

export type ProcessorsContext<ProcessorScope> = ProcessorContext<ProcessorScope> & {
    processors: ProcessorInfo<any, any>[];
};