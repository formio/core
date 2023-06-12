import { ProcessContext } from 'types/process/ProcessContext.js';
import { Component } from '../types/Component.js';

type FieldErrorConstructorArgs = {
    component: Component;
    errorKeyOrMessage: string;
    field: string;
    context: ProcessContext;
}
export class FieldError {
    path: string;
    context: ProcessContext;
    errorKeyOrMessage: string;
    field: string;
    constructor({component, errorKeyOrMessage, field, context}: FieldErrorConstructorArgs) {
        this.path = component.key;
        this.context = context;
        this.errorKeyOrMessage = errorKeyOrMessage;
        this.field = field;
    }
}
