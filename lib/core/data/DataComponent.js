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
exports.DataComponent = exports.NestedDataComponent = void 0;
var Components_1 = require("../Components");
var Component_1 = require("../component/Component");
var NestedComponent_1 = require("../nested/NestedComponent");
var NestedDataModel_1 = require("../../model/NestedDataModel");
exports.NestedDataComponent = NestedComponent_1.NestedComponentWithModel(Component_1.ComponentWithModel(NestedDataModel_1.NestedDataModel(Components_1.Components)));
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
function DataComponent() {
    var props = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        props[_i] = arguments[_i];
    }
    props.unshift({ type: 'data' });
    return /** @class */ (function (_super) {
        __extends(ExtendedDataComponent, _super);
        function ExtendedDataComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ExtendedDataComponent;
    }(exports.NestedDataComponent.apply(void 0, props)));
}
exports.DataComponent = DataComponent;
Components_1.Components.addBaseComponent(DataComponent, 'data');
Components_1.Components.addComponent(DataComponent());
