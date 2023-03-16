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
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.NestedArrayModel = void 0;
var _ = __importStar(require("@formio/lodash"));
var NestedDataModel_1 = require("./NestedDataModel");
function NestedArrayModel(props) {
    if (props === void 0) { props = {}; }
    return function (BaseClass) {
        return /** @class */ (function (_super) {
            __extends(BaseNestedArrayModel, _super);
            function BaseNestedArrayModel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(BaseNestedArrayModel.prototype, "defaultValue", {
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
            BaseNestedArrayModel.prototype.row = function (index) {
                return (index < this.rows.length) ? this.rows[index] : [];
            };
            /**
             * Removes a row and detatches all components within that row.
             *
             * @param index The index of the row to remove.
             */
            BaseNestedArrayModel.prototype.removeRow = function (index) {
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
            BaseNestedArrayModel.prototype.addRow = function (data, index) {
                if (data === void 0) { data = {}; }
                if (index === void 0) { index = 0; }
                var rowData = data;
                this.dataValue[index] = rowData;
                this.createRowComponents(rowData, index);
            };
            /**
             * Sets the data for a specific row of components.
             * @param rowData The data to set
             * @param index The index of the rows to set the data within.
             */
            BaseNestedArrayModel.prototype.setRowData = function (rowData, index) {
                var _a;
                this.dataValue[index] = rowData;
                (_a = this.row(index)) === null || _a === void 0 ? void 0 : _a.forEach(function (comp) { return (comp.data = rowData); });
            };
            /**
             * Determines if the data within a row has changed.
             *
             * @param rowData
             * @param index
             */
            BaseNestedArrayModel.prototype.rowChanged = function (rowData, index) {
                var _a;
                var changed = false;
                (_a = this.row(index)) === null || _a === void 0 ? void 0 : _a.forEach(function (comp) {
                    var hasChanged = comp.hasChanged(_.get(rowData, comp.component.key));
                    changed = hasChanged || changed;
                    if (hasChanged) {
                        comp.bubble('change', comp);
                    }
                });
                return changed;
            };
            /**
             * Creates all components for each row.
             * @param data
             * @returns
             */
            BaseNestedArrayModel.prototype.createComponents = function (data) {
                var _this = this;
                this.rows = [];
                var added = [];
                this.eachRowValue(data, function (row, index) {
                    added = added.concat(_this.createRowComponents(row, index));
                });
                return added;
            };
            /**
             * Creates a new row of components.
             *
             * @param data The data context to pass along to this row of components.
             */
            BaseNestedArrayModel.prototype.createRowComponents = function (data, index) {
                if (index === void 0) { index = 0; }
                var comps = _super.prototype.createComponents.call(this, data, function (comp) {
                    comp.rowIndex = index;
                });
                this.rows[index] = comps;
                return comps;
            };
            BaseNestedArrayModel.prototype.getIndexes = function (value) {
                if (_super.prototype.getIndexes) {
                    return _super.prototype.getIndexes.call(this, value);
                }
                return {
                    min: 0,
                    max: (value.length - 1)
                };
            };
            BaseNestedArrayModel.prototype.eachRowValue = function (value, fn) {
                if (!value || !value.length) {
                    return;
                }
                var indexes = this.getIndexes(value);
                for (var i = indexes.min; i <= indexes.max; i++) {
                    fn(value[i], i);
                }
            };
            Object.defineProperty(BaseNestedArrayModel.prototype, "emptyValue", {
                /**
                 * The empty value for this component.
                 *
                 * @return {array}
                 */
                get: function () {
                    return [];
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseNestedArrayModel.prototype, "dataValue", {
                /**
                 * Returns the dataValue for this component.
                 */
                get: function () {
                    return _.get(this.data, this.component.key);
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
            BaseNestedArrayModel.prototype.hasChanged = function (value) {
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
            BaseNestedArrayModel.prototype.setValue = function (value) {
                var changed = false;
                this.eachComponentValue(value, function (comp, val) {
                    changed = comp.setValue(val) || changed;
                });
                return changed;
            };
            return BaseNestedArrayModel;
        }((0, NestedDataModel_1.NestedDataModel)(props)(BaseClass)));
    };
}
exports.NestedArrayModel = NestedArrayModel;
;
