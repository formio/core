import { Component, DataObject } from "types"
import { ProcessorFn, ProcessorFnSync } from "./ProcessorFn";
import { ProcessType } from "./ProcessType";

export type ProcessOneContext = {
    component: Component;
    path: string;
    data: DataObject;
    row: any;
    // TODO: need to type instance
    instance?: any;
    before?: ProcessorFn[];
    after?: ProcessorFn[];
    process?: ProcessType;
}

export type ProcessOneContextSync = {
    component: Component;
    path: string;
    data: DataObject;
    row: any;
    // TODO: need to type instance
    instance?: any;
    before?: ProcessorFnSync[];
    after?: ProcessorFnSync[];
    process?: ProcessType;
}
