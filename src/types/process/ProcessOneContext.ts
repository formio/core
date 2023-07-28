import { Component } from "types/Component.js";
import { DataObject } from "types/DataObject.js";
import { ProcessorFn } from "./ProcessorFn.js";
import { ProcessType } from "./ProcessType.js";

export type ProcessOneContext = {
    component: Component;
    path: string;
    data: DataObject;
    before?: ProcessorFn[];
    after?: ProcessorFn[];
    process?: ProcessType;
}
