"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayComponent = void 0;
const Components_1 = require("../Components");
const model_1 = require("../../model");
const NestedComponent_1 = require("../nested/NestedComponent");
/**
 * An array data type component. This provides a nested component that creates "rows" of data
 * where each row creates new instances of the JSON components and sets the data context for
 * each row according to the row it is within.
 *
 * For example, if you have the following JSON schema.
 *
 * ```
 * {
 *   type: 'array',
 *   key: 'customers',
 *   components: [
 *     {
 *        type: 'datavalue',
 *        key: 'firstName'
 *     },
 *     {
 *        type: 'datavalue',
 *        key: 'lastName'
 *     }
 *   ]
 * }
 * ```
 *
 * You can now create multiple rows using the following data.
 *
 * ```
 * {
 *    customers: [
 *      {firstName: 'Joe', lastName: 'Smith'},
 *      {firstName: 'Sally', lastName: 'Thompson'},
 *      {firstName: 'Sue', lastName: 'Warner'}
 *    ]
 * }
 * ```
 */
function ArrayComponent(props = {}) {
    if (!props.type) {
        props.type = 'array';
    }
    if (!props.model) {
        props.model = model_1.NestedArrayModel;
    }
    return function (BaseClass) {
        return class ExtendedArrayComponent extends (0, NestedComponent_1.NestedComponent)(props)(BaseClass) {
        };
    };
}
exports.ArrayComponent = ArrayComponent;
Components_1.Components.addDecorator(ArrayComponent, 'array');
Components_1.Components.addComponent(ArrayComponent()(), 'array');
