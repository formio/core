import { Component, DataObject, PassedComponentInstance } from "types"
import { ProcessorFn, ProcessorFnSync } from "./ProcessorFn";
import { ProcessType } from "./ProcessType";

export type ProcessOneContext = {
    component: Component;
    path: string;
    data: DataObject;
    // TODO: We need to type `row` data
    row: any;
    instance?: PassedComponentInstance;
    before?: ProcessorFn[];
    after?: ProcessorFn[];
    process?: ProcessType;
}

export type ProcessOneContextSync = {
    component: Component;
    path: string;
    data: DataObject;
    row: any;
    instance?: PassedComponentInstance;
    before?: ProcessorFnSync[];
    after?: ProcessorFnSync[];
    process?: ProcessType;
}
