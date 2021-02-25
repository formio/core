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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataComponent = void 0;
var Component_1 = require("../component/Component");
var NestedComponent_1 = require("../nested/NestedComponent");
var _ = __importStar(require("../../util/util"));
var compDataValue = Object.getOwnPropertyDescriptor(Component_1.Component.prototype, 'dataValue');
var nestedDataValue = Object.getOwnPropertyDescriptor(NestedComponent_1.NestedComponent.prototype, 'dataValue');
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
var DataComponent = /** @class */ (function (_super) {
    __extends(DataComponent, _super);
    function DataComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DataComponent.prototype, "defaultValue", {
        get: function () {
            return {};
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the component data.
     */
    DataComponent.prototype.componentData = function () {
        var compData = _.get(this.data, this.component.key, this.defaultValue);
        if (!Object.keys(compData).length) {
            _.set(this.data, this.component.key, compData);
        }
        return compData;
    };
    Object.defineProperty(DataComponent.prototype, "dataValue", {
        /**
         * Get the datavalue of this component.
         */
        get: function () {
            return compDataValue.get.call(this);
        },
        set: function (value) {
            nestedDataValue.set.call(this, value);
        },
        enumerable: false,
        configurable: true
    });
    return DataComponent;
}(NestedComponent_1.NestedComponent));
exports.DataComponent = DataComponent;
