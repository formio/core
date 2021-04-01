import { Component, ComponentOptions } from '../component/Component';
import { NestedComponentSchema } from '../nested/NestedComponent';
import { DataComponent } from '../data/DataComponent';
import * as _ from '@formio/lodash';
const compDataValue: any = Object.getOwnPropertyDescriptor(Component.prototype, 'dataValue');

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
export class ArrayComponent extends DataComponent {
    /**
     * The rows for this component. Each row contains new instances of components.
     */
    public rows!: Array<Array<Component>>;
    get defaultValue() {
        return [];
    }

    /**
     * Returns a row of componments at the provided index.
     * @param index The index of the row to return
     */
    row(index: number): Array<Component> {
        return (index < this.rows.length) ? this.rows[index] : [];
    }

    /**
     * Removes a row and detatches all components within that row.
     *
     * @param index The index of the row to remove.
     */
    removeRow(index: number) {
        this.row(index).forEach((comp: Component) => this.removeComponent(comp));
        this.dataValue.splice(index, 1);
        this.rows.splice(index, 1);
    }

    /**
     * Adds a new row of components.
     *
     * @param data The data context to pass to this row of components.
     */
    addRow(data: any = {}, index: number = 0) {
        const rowData = data;
        this.dataValue[index] = rowData;
        this.createComponents(rowData, index);
    }

    /**
     * Sets the data for a specific row of components.
     * @param rowData The data to set
     * @param index The index of the rows to set the data within.
     */
    setRowData(rowData: any, index: number) {
        this.dataValue[index] = rowData;
        this.row(index).forEach((comp: Component) => (comp.data = rowData));
    }

    /**
     * Determines if the data within a row has changed.
     *
     * @param rowData
     * @param index
     */
    rowChanged(rowData: any, index: number): boolean {
        let changed = false;
        this.row(index).forEach((comp: Component) => {
            const hasChanged: boolean = comp.hasChanged(_.get(rowData, comp.component.key));
            changed = hasChanged || changed;
            if (hasChanged) {
                comp.bubble('change', comp);
            }
        });
        return changed;
    }

    /**
     * Creates a new row of components.
     *
     * @param data The data context to pass along to this row of components.
     */
    createComponents(data: any, index: number = 0): Array<Component> {
        const comps = super.createComponents(data);
        this.rows[index] = comps;
        return comps;
    }

    /**
     * Initializes the nested components provided the data context.
     */
    initComponents() {
        this.rows = [];
        this.eachRowValue(this.componentData(), (row: any, index: number) => this.createComponents(row, index));
    }

    getIndexes(value: Array<any>) {
        return {
            min: 0,
            max: (value.length - 1)
        };
    }

    eachRowValue(value: any, fn: any) {
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
     get emptyValue(): any {
        return [];
    }
    /**
     * Returns the dataValue for this component.
     */
    public get dataValue() {
        return compDataValue.get.call(this);
    }

    /**
     * Set the datavalue of an array component.
     *
     * @param value The value to set this component to.
     */
    public set dataValue(value: any) {
        // Only set the value if it is an array.
        if (Array.isArray(value)) {
            // Get the current data value.
            const dataValue = this.dataValue;
            this.eachRowValue(value, (row: any, index: number) => {
                if (index >= dataValue.length) {
                    this.addRow(row, index);
                }
                this.setRowData(row, index)
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
    public hasChanged(value: any): boolean {
        const dataValue = this.dataValue;
        // If the length changes, then this compnent has changed.
        if (value.length !== dataValue.length) {
            this.emit('changed', this);
            return true;
        }
        let changed = false;
        this.eachRowValue(value, (rowData: any, index: number) => {
            changed = this.rowChanged(rowData, index) || changed;
        });
        return changed;
    }

    /**
     * Sets the value of an array component.
     *
     * @param value
     */
    public setValue(value: any): boolean {
        var changed = false;
        this.eachComponentValue(value, (comp: any, val: any) => {
            changed = comp.setValue(val) || changed;
        });
        return changed;
    }
}