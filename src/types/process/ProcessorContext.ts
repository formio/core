import { Component, DataObject, ProcessorType } from "types";
import { FieldError } from 'error';

export type ProcessorContext = {
    component: Component;
    data: DataObject;
    row: any;
    path: string;
    // TODO: need to type instance
    instance?: any;
    processor: ProcessorType;
    errors?: FieldError[];
    process?: string;
    index?: number;
    config?: Record<string, any>;
}
