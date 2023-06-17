import { ProcessType } from "./ProcessType.js";
import { ProcessorType } from "./ProcessorType.js";
import { Component, DataObject, RuleFn } from "types";

export type ProcessorContext = {
    component: Component;
    data: DataObject;
    path: string;
    process: ProcessorType;
    metaProcess?: ProcessType;
    config?: Record<string, any>;
}
