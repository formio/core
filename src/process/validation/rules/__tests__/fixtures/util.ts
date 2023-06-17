import { Component, DataObject, ProcessorContext, ProcessorType } from "types";

export const generateProcessContext = (component: Component, data: DataObject): ProcessorContext => {
    return { component, data, path: component.key, process: ProcessorType.Validator };
}
