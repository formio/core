import { Component, DataObject, ProcessorType } from "types";
import { FieldError } from 'error';

export type ProcessorContext = {
    component: Component;
    data: DataObject;
    path: string;
    processor: ProcessorType;
    evalContext?: any;
    errors?: FieldError[];
    process?: string;
    index?: number;
    config?: Record<string, any>;
}
