import { MetaProcess } from "./MetaProcess.js";
import { ProcessType } from "./ProcessType.js";
import { Component, DataObject, RuleFn } from "types";

export type ProcessContext = {
    component: Component;
    data: DataObject;
    path: string;
    process: ProcessType;
    metaProcess?: MetaProcess;
    config?: Record<string, any>;
}
