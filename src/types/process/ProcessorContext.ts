import { Component, DataObject, ProcessorType } from "types";
import { FieldError } from 'error';

export type ProcessorContext = {
    component: Component;
    data: DataObject;
    path: string;
    processor: ProcessorType;
    errors?: FieldError[];
    process?: string;
    config?: Record<string, any>;
}
