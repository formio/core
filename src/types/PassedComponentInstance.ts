import { Component } from "./Component";
import { DataObject } from "./DataObject";
import { Form } from "./Form";

export type PassedComponentInstance = {
    evalContext: () => {
        component: Component,
        data: DataObject,
        row: DataObject,
        rowIndex: number,
        iconClass: string,
        t: (message: string) => string,
        submission: {
            data: DataObject
        },
        form: Form,
        options: Record<string, any>
    },
    shouldSkipValidation: (data?: DataObject, row?: DataObject) => boolean;
}
