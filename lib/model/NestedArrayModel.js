"use strict";
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
const _ = __importStar(require("@formio/lodash"));
const NestedDataModel_1 = require("./NestedDataModel");
function NestedArrayModel(props = {}) {
    return function (BaseClass) {
        return class BaseNestedArrayModel extends (0, NestedDataModel_1.NestedDataModel)(props)(BaseClass) {
            get defaultValue() {
                return [];
            }
            /**
             * Returns a row of componments at the provided index.
             * @param index The index of the row to return
             */
            row(index) {
                return (index < this.rows.length) ? this.rows[index] : [];
            }
            /**
             * Removes a row and detatches all components within that row.
             *
             * @param index The index of the row to remove.
             */
            removeRow(index) {
                this.row(index).forEach((comp) => this.removeComponent(comp));
                this.dataValue.splice(index, 1);
                this.rows.splice(index, 1);
            }
            /**
             * Adds a new row of components.
             *
             * @param data The data context to pass to this row of components.
             */
            addRow(data = {}, index = 0) {
                const rowData = data;
                this.dataValue[index] = rowData;
                this.createRowComponents(rowData, index);
            }
            /**
             * Sets the data for a specific row of components.
             * @param rowData The data to set
             * @param index The index of the rows to set the data within.
             */
            setRowData(rowData, index) {
                var _a;
                this.dataValue[index] = rowData;
                (_a = this.row(index)) === null || _a === void 0 ? void 0 : _a.forEach((comp) => (comp.data = rowData));
            }
            /**
             * Determines if the data within a row has changed.
             *
             * @param rowData
             * @param index
             */
            rowChanged(rowData, index) {
                var _a;
                let changed = false;
                (_a = this.row(index)) === null || _a === void 0 ? void 0 : _a.forEach((comp) => {
                    const hasChanged = comp.hasChanged(_.get(rowData, comp.component.key));
                    changed = hasChanged || changed;
                    if (hasChanged) {
                        comp.bubble('change', comp);
                    }
                });
                return changed;
            }
            /**
             * Creates all components for each row.
             * @param data
             * @returns
             */
            createComponents(data) {
                this.rows = [];
                let added = [];
                this.eachRowValue(data, (row, index) => {
                    added = added.concat(this.createRowComponents(row, index));
                });
                return added;
            }
            /**
             * Creates a new row of components.
             *
             * @param data The data context to pass along to this row of components.
             */
            createRowComponents(data, index = 0) {
                const comps = super.createComponents(data, (comp) => {
                    comp.rowIndex = index;
                });
                this.rows[index] = comps;
                return comps;
            }
            getIndexes(value) {
                if (super.getIndexes) {
                    return super.getIndexes(value);
                }
                return {
                    min: 0,
                    max: (value.length - 1)
                };
            }
            eachRowValue(value, fn) {
                if (!value || !value.length) {
                    return;
                }
                const indexes = this.getIndexes(value);
                for (let i = indexes.min; i <= indexes.max; i++) {
                    fn(value[i], i);
                }
            }
            /**
             * The empty value for this component.
             *
             * @return {array}
             */
            get emptyValue() {
                return [];
            }
            /**
             * Returns the dataValue for this component.
             */
            get dataValue() {
                return _.get(this.data, this.component.key);
            }
            /**
             * Set the datavalue of an array component.
             *
             * @param value The value to set this component to.
             */
            set dataValue(value) {
                // Only set the value if it is an array.
                if (Array.isArray(value)) {
                    // Get the current data value.
                    const dataValue = this.dataValue;
                    this.eachRowValue(value, (row, index) => {
                        if (index >= dataValue.length) {
                            this.addRow(row, index);
                        }
                        this.setRowData(row, index);
                    });
                    // Remove superfluous rows.
                    if (dataValue.length > value.length) {
                        for (let i = value.length; i < dataValue.length; i++) {
                            this.removeRow(i);
                        }
                    }
                }
            }
            /**
             * Determine if this array component has changed.
             *
             * @param value
             */
            hasChanged(value) {
                const dataValue = this.dataValue;
                // If the length changes, then this compnent has changed.
                if (value.length !== dataValue.length) {
                    this.emit('changed', this);
                    return true;
                }
                let changed = false;
                this.eachRowValue(value, (rowData, index) => {
                    changed = this.rowChanged(rowData, index) || changed;
                });
                return changed;
            }
            /**
             * Sets the value of an array component.
             *
             * @param value
             */
            setValue(value) {
                var changed = false;
                this.eachComponentValue(value, (comp, val) => {
                    changed = comp.setValue(val) || changed;
                });
                return changed;
            }
        };
    };
}
exports.NestedArrayModel = NestedArrayModel;
;
