import _ from "lodash";
import { Component, DataObject, ProcessorType, ValidationContext } from "types";

export const generateProcessContext = (component: Component, data: DataObject): ValidationContext => {
    const path = component.key;
    const value = _.get(data, path);
    return { component, data, scope: {errors: []}, row: data, path: component.key, value, processor: ProcessorType.Validate };
}
