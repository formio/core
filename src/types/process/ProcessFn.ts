import { FieldError } from "error/FieldError"
import { Component } from "../Component.js";
import { DataObject } from "../DataObject.js";
import { RuleFn } from "../RuleFn.js";
import { ProcessContext } from "./ProcessContext.js";

type ProcessFnArgs = {
    component: Component,
    data: DataObject,
    rules?: RuleFn[],
    config?: {
        context: ProcessContext,
        [key: string]: any
    }
}

export type ProcessFn = ({component, data, rules, config}: ProcessFnArgs) => Promise<FieldError[]>;
