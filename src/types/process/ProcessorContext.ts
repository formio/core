import { ProcessType } from "./ProcessType.js";
import { ProcessorType } from "./ProcessorType.js";
import { Component, DataObject } from "types";
import { FieldError } from 'error';

export type ProcessorContext = {
    component: Component;
    data: DataObject;
    path: string;
    processor: ProcessorType;
    errors?: FieldError[]
    process?: ProcessType;
    config?: Record<string, any>;
}
