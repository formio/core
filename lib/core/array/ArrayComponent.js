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
exports.ArrayComponent = exports.NestedArrayComponent = void 0;
var Components_1 = require("../Components");
var Component_1 = require("../component/Component");
var NestedComponent_1 = require("../nested/NestedComponent");
var NestedArrayModel_1 = require("../../model/NestedArrayModel");
exports.NestedArrayComponent = NestedComponent_1.NestedComponentWithModel(Component_1.ComponentWithModel(NestedArrayModel_1.NestedArrayModel(Components_1.Components)));
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
function ArrayComponent() {
    var props = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        props[_i] = arguments[_i];
    }
    props.unshift({ type: 'array' });
    return /** @class */ (function (_super) {
        __extends(ExtendedArrayComponent, _super);
        function ExtendedArrayComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ExtendedArrayComponent;
    }(exports.NestedArrayComponent.apply(void 0, props)));
}
exports.ArrayComponent = ArrayComponent;
Components_1.Components.addComponent(ArrayComponent, 'array');
