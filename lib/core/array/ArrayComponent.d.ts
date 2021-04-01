import { Component } from '../component/Component';
import { DataComponent } from '../data/DataComponent';
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
export declare class ArrayComponent extends DataComponent {
    /**
     * The rows for this component. Each row contains new instances of components.
     */
    rows: Array<Array<Component>>;
    get defaultValue(): never[];
    /**
     * Returns a row of componments at the provided index.
     * @param index The index of the row to return
     */
    row(index: number): Array<Component>;
    /**
     * Removes a row and detatches all components within that row.
     *
     * @param index The index of the row to remove.
     */
    removeRow(index: number): void;
    /**
     * Adds a new row of components.
     *
     * @param data The data context to pass to this row of components.
     */
    addRow(data?: any, index?: number): void;
    /**
     * Sets the data for a specific row of components.
     * @param rowData The data to set
     * @param index The index of the rows to set the data within.
     */
    setRowData(rowData: any, index: number): void;
    /**
     * Determines if the data within a row has changed.
     *
     * @param rowData
     * @param index
     */
    rowChanged(rowData: any, index: number): boolean;
    /**
     * Creates a new row of components.
     *
     * @param data The data context to pass along to this row of components.
     */
    createComponents(data: any, index?: number): Array<Component>;
    /**
     * Initializes the nested components provided the data context.
     */
    initComponents(): void;
    getIndexes(value: Array<any>): {
        min: number;
        max: number;
    };
    eachRowValue(value: any, fn: any): void;
    /**
     * The empty value for this component.
     *
     * @return {array}
     */
    get emptyValue(): any;
    /**
     * Returns the dataValue for this component.
     */
    get dataValue(): any;
    /**
     * Set the datavalue of an array component.
     *
     * @param value The value to set this component to.
     */
    set dataValue(value: any);
    /**
     * Determine if this array component has changed.
     *
     * @param value
     */
    hasChanged(value: any): boolean;
    /**
     * Sets the value of an array component.
     *
     * @param value
     */
    setValue(value: any): boolean;
}
