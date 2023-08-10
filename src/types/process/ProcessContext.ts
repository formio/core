import { Component, DataObject, PassedComponentInstance, ProcessorFn, ProcessorFnSync, ProcessType } from "types";

export type ProcessContext = {
    components: Component[];
    data: DataObject;
    // TODO: woof, we have to type component instances
    instances?: {
        [key: string]: PassedComponentInstance;
    }
    before?: ProcessorFn[];
    after?: ProcessorFn[];
    process?: ProcessType;
}

export type ProcessContextSync = {
    components: Component[];
    data: DataObject;
    instances?: {
        [key: string]: any;
    }
    before?: ProcessorFnSync[];
    after?: ProcessorFnSync[];
    process?: ProcessType;
}
