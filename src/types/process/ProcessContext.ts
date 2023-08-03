import { Component, DataObject, ProcessorFn, ProcessorFnSync, ProcessType } from "types";

export type ProcessContext = {
    components: Component[];
    data: DataObject;
    before?: ProcessorFn[];
    after?: ProcessorFn[];
    process?: ProcessType;
}

export type ProcessContextSync = {
    components: Component[];
    data: DataObject;
    before?: ProcessorFnSync[];
    after?: ProcessorFnSync[];
    process?: ProcessType;
}
