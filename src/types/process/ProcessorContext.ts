import { Component, DataObject, Form, PassedComponentInstance, ProcessorType } from "types";
import { FieldError } from 'error';

export type ProcessorContext = {
    component: Component;
    data: DataObject;
    row: any;
    path: string;
    instance?: PassedComponentInstance;
    processor: ProcessorType;
    errors?: FieldError[];
    process?: string;
    index?: number;
    config?: Record<string, any>;
}
