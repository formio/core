"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataComponent = void 0;
const Components_1 = require("../Components");
const model_1 = require("../../model");
const NestedComponent_1 = require("../nested/NestedComponent");
/**
 * A DataComponent is one that establishes a new data context for all of its
 * children at the specified "key" of this comopnent. For example, if this data
 * component has a key of "employee", and then some components within the data
 * component of "firstName" and "lastName", the data structure provided by this
 * component would resemble the following.
 *
 * {
 *   "employee": {
 *      "firstName": "Bob",
 *      "lastName": "Smith"
 *   }
 * }
 */
function DataComponent(props = {}) {
    if (!props.type) {
        props.type = 'data';
    }
    if (!props.model) {
        props.model = model_1.NestedDataModel;
    }
    return function (BaseClass) {
        return class ExtendedDataComponent extends (0, NestedComponent_1.NestedComponent)(props)(BaseClass) {
        };
    };
}
exports.DataComponent = DataComponent;
Components_1.Components.addDecorator(DataComponent, 'data');
Components_1.Components.addComponent(DataComponent()(), 'data');
