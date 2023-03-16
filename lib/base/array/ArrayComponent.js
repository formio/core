"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayComponent = void 0;
var Components_1 = require("../Components");
var model_1 = require("../../model");
var NestedComponent_1 = require("../nested/NestedComponent");
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
function ArrayComponent(props) {
    if (props === void 0) { props = {}; }
    if (!props.type) {
        props.type = 'array';
    }
    if (!props.model) {
        props.model = model_1.NestedArrayModel;
    }
    return function (BaseClass) {
        return /** @class */ (function (_super) {
            __extends(ExtendedArrayComponent, _super);
            function ExtendedArrayComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ExtendedArrayComponent;
        }((0, NestedComponent_1.NestedComponent)(props)(BaseClass)));
    };
}
exports.ArrayComponent = ArrayComponent;
Components_1.Components.addDecorator(ArrayComponent, 'array');
Components_1.Components.addComponent(ArrayComponent()(), 'array');
