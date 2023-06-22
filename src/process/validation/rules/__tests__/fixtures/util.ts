import _ from "lodash";
import { Component, DataObject, RuleContext } from "types";

export const generateProcessContext = (component: Component, data: DataObject): RuleContext => {
    const path = component.key;
    const value = _.get(data, path);
    return { component, data, path: component.key, value, processor: "validate" };
}
