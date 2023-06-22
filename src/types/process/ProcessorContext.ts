import { Component, DataObject } from "types";
import { FieldError } from 'error';

export type ProcessorContext = {
    component: Component;
    data: DataObject;
    path: string;
    processor: string;
    errors?: FieldError[];
    process?: string;
    config?: Record<string, any>;
}
