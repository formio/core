import { Component, DataObject, ProcessorFn, ProcessType } from "types";

export type ProcessContext = {
    components: Component[];
    data: DataObject;
    before?: ProcessorFn[];
    after?: ProcessorFn[];
    process?: ProcessType;
}
