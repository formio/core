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
exports.DataComponent = void 0;
var Components_1 = require("../Components");
var NestedComponent_1 = require("../nested/NestedComponent");
var NestedDataModel_1 = require("../../model/NestedDataModel");
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
function DataComponent(props) {
    if (props === void 0) { props = {}; }
    if (!props.type) {
        props.type = 'data';
    }
    if (!props.model) {
        props.model = NestedDataModel_1.NestedDataModel;
    }
    return function (BaseClass) {
        return /** @class */ (function (_super) {
            __extends(ExtendedDataComponent, _super);
            function ExtendedDataComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ExtendedDataComponent;
        }(NestedComponent_1.NestedComponent(props)(BaseClass)));
    };
}
exports.DataComponent = DataComponent;
Components_1.Components.addDecorator(DataComponent, 'data');
Components_1.Components.addComponent(DataComponent()(), 'data');
