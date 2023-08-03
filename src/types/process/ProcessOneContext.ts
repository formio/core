import { Component, DataObject } from "types"
import { ProcessorFn, ProcessorFnSync } from "./ProcessorFn";
import { ProcessType } from "./ProcessType";

export type ProcessOneContext = {
    component: Component;
    path: string;
    data: DataObject;
    // TODO: need to type evalcontext
    evalContext?: any;
    before?: ProcessorFn[];
    after?: ProcessorFn[];
    process?: ProcessType;
}

export type ProcessOneContextSync = {
    component: Component;
    path: string;
    data: DataObject;
    // TODO: need to type evalcontext
    evalContext?: any;
    before?: ProcessorFnSync[];
    after?: ProcessorFnSync[];
    process?: ProcessType;
}
