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
var util_1 = require("../../util");
var compDataValue = Object.getOwnPropertyDescriptor(Component_1.Component.prototype, 'dataValue');
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
    /**
     * Returns a row of componments at the provided index.
     * @param index The index of the row to return
     */
    ArrayComponent.prototype.row = function (index) {
        return (index < this.rows.length) ? this.rows[index] : [];
    };
    /**
     * Removes a row and detatches all components within that row.
     *
     * @param index The index of the row to remove.
     */
    ArrayComponent.prototype.removeRow = function (index) {
        var _this = this;
        this.row(index).forEach(function (comp) { return _this.removeComponent(comp); });
        this.dataValue.splice(index, 1);
        this.rows.splice(index, 1);
    };
    /**
     * Adds a new row of components.
     *
     * @param data The data context to pass to this row of components.
     */
    ArrayComponent.prototype.addRow = function (data, index) {
        if (data === void 0) { data = {}; }
        if (index === void 0) { index = 0; }
        var rowData = data;
        this.dataValue[index] = rowData;
        this.createComponents(rowData, index);
    };
    /**
     * Sets the data for a specific row of components.
     * @param rowData The data to set
     * @param index The index of the rows to set the data within.
     */
    ArrayComponent.prototype.setRowData = function (rowData, index) {
        this.dataValue[index] = rowData;
        this.row(index).forEach(function (comp) { return (comp.data = rowData); });
    };
    /**
     * Determines if the data within a row has changed.
     *
     * @param rowData
     * @param index
     */
    ArrayComponent.prototype.rowChanged = function (rowData, index) {
        var changed = false;
        this.row(index).forEach(function (comp) {
            var hasChanged = comp.hasChanged(util_1.lodash.get(rowData, comp.component.key));
            changed = hasChanged || changed;
            if (hasChanged) {
                comp.bubble('change', comp);
            }
        });
        return changed;
    };
    /**
     * Creates a new row of components.
     *
     * @param data The data context to pass along to this row of components.
     */
    ArrayComponent.prototype.createComponents = function (data, index) {
        if (index === void 0) { index = 0; }
        var comps = _super.prototype.createComponents.call(this, data);
        this.rows[index] = comps;
        return comps;
    };
    /**
     * Initializes the nested components provided the data context.
     */
    ArrayComponent.prototype.initComponents = function () {
        var _this = this;
        this.rows = [];
        this.eachRowValue(this.componentData(), function (row, index) { return _this.createComponents(row, index); });
    };
    ArrayComponent.prototype.getIndexes = function (value) {
        return {
            min: 0,
            max: (value.length - 1)
        };
    };
    ArrayComponent.prototype.eachRowValue = function (value, fn) {
        if (!value || !value.length) {
            return;
        }
        var indexes = this.getIndexes(value);
        for (var i = indexes.min; i <= indexes.max; i++) {
            fn(value[i], i);
        }
    };
    Object.defineProperty(ArrayComponent.prototype, "dataValue", {
        /**
         * Returns the dataValue for this component.
         */
        get: function () {
            return compDataValue.get.call(this);
        },
        /**
         * Set the datavalue of an array component.
         *
         * @param value The value to set this component to.
         */
        set: function (value) {
            var _this = this;
            // Only set the value if it is an array.
            if (Array.isArray(value)) {
                // Get the current data value.
                var dataValue_1 = this.dataValue;
                this.eachRowValue(value, function (row, index) {
                    if (index >= dataValue_1.length) {
                        _this.addRow(row, index);
                    }
                    _this.setRowData(row, index);
                });
                // Remove superfluous rows.
                if (dataValue_1.length > value.length) {
                    for (var i = value.length; i < dataValue_1.length; i++) {
                        this.removeRow(i);
                    }
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Determine if this array component has changed.
     *
     * @param value
     */
    ArrayComponent.prototype.hasChanged = function (value) {
        var _this = this;
        var dataValue = this.dataValue;
        // If the length changes, then this compnent has changed.
        if (value.length !== dataValue.length) {
            this.emit('changed', this);
            return true;
        }
        var changed = false;
        this.eachRowValue(value, function (rowData, index) {
            changed = _this.rowChanged(rowData, index) || changed;
        });
        return changed;
    };
    /**
     * Sets the value of an array component.
     *
     * @param value
     */
    ArrayComponent.prototype.setValue = function (value) {
        var changed = false;
        this.eachComponentValue(value, function (comp, val) {
            changed = comp.setValue(val) || changed;
        });
        return changed;
    };
    return ArrayComponent;
}(DataComponent_1.DataComponent));
exports.ArrayComponent = ArrayComponent;
