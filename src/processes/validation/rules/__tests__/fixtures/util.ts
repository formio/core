import { Component, DataObject, ProcessContext, ProcessType } from "types";

export const generateProcessContext = (component: Component, data: DataObject): ProcessContext => {
    return { component, data, path: component.key, process: ProcessType.Validation };
}
