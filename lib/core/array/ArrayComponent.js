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
var Component_1 = require("../component/Component");
var DataComponent_1 = require("../data/DataComponent");
var compDataValue = Object.getOwnPropertyDescriptor(Component_1.Component.prototype, 'dataValue');
var ArrayComponent = /** @class */ (function (_super) {
    __extends(ArrayComponent, _super);
    function ArrayComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ArrayComponent.prototype, "defaultValue", {
        get: function () {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    ArrayComponent.prototype.row = function (index) {
        return (index < this.rows.length) ? this.rows[index] : [];
    };
    ArrayComponent.prototype.removeRow = function (index) {
        var _this = this;
        this.row(index).forEach(function (comp) { return _this.removeComponent(comp); });
        this.dataValue.splice(index, 1);
        this.rows.splice(index, 1);
    };
    ArrayComponent.prototype.addRow = function (data) {
        if (data === void 0) { data = {}; }
        var rowData = data;
        this.dataValue.push(rowData);
        this.createComponents(rowData);
    };
    ArrayComponent.prototype.setRowData = function (rowData, index) {
        this.dataValue[index] = rowData;
        this.row(index).forEach(function (comp) { return (comp.data = rowData); });
    };
    ArrayComponent.prototype.createComponents = function (data) {
        var comps = _super.prototype.createComponents.call(this, data);
        this.rows.push(comps);
        return comps;
    };
    ArrayComponent.prototype.initComponents = function () {
        var _this = this;
        this.rows = [];
        var data = this.componentData();
        if (data.length) {
            data.forEach(function (row) { return _this.createComponents(row); });
        }
    };
    Object.defineProperty(ArrayComponent.prototype, "dataValue", {
        get: function () {
            return compDataValue.get.call(this);
        },
        /**
         * Set the datavalue of an array component.
         */
        set: function (value) {
            var _this = this;
            // Only set the value if it is an array.
            if (Array.isArray(value)) {
                // Get the current data value.
                var dataValue = this.dataValue;
                // Add additional rows.
                if (value.length > dataValue.length) {
                    for (var i = dataValue.length; i < value.length; i++) {
                        this.addRow(value[i]);
                    }
                }
                // Remove superfluous rows.
                if (dataValue.length > value.length) {
                    for (var i = value.length; i < dataValue.length; i++) {
                        this.removeRow(i);
                    }
                }
                // Set the new data value.
                value.forEach(function (rowData, index) { return _this.setRowData(rowData, index); });
            }
        },
        enumerable: false,
        configurable: true
    });
    return ArrayComponent;
}(DataComponent_1.DataComponent));
exports.ArrayComponent = ArrayComponent;
