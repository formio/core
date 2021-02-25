import { Component } from '../component/Component';
import { DataComponent } from '../data/DataComponent';
const compDataValue: any = Object.getOwnPropertyDescriptor(Component.prototype, 'dataValue');

export class ArrayComponent extends DataComponent {
    public rows!: Array<Array<Component>>;
    get defaultValue() {
        return [];
    }

    row(index: number) {
        return (index < this.rows.length) ? this.rows[index] : [];
    }

    removeRow(index: number) {
        this.row(index).forEach((comp: Component) => this.removeComponent(comp));
        this.dataValue.splice(index, 1);
        this.rows.splice(index, 1);
    }

    addRow(data: any = {}) {
        const rowData = data;
        this.dataValue.push(rowData);
        this.createComponents(rowData);
    }

    setRowData(rowData: any, index: number) {
        this.dataValue[index] = rowData;
        this.row(index).forEach((comp: Component) => (comp.data = rowData));
    }

    createComponents(data: any): Array<Component> {
        const comps = super.createComponents(data);
        this.rows.push(comps);
        return comps;
    }

    initComponents() {
        this.rows = [];
        const data = this.componentData();
        if (data.length) {
            data.forEach((row: any) => this.createComponents(row));
        }
    }

    public get dataValue() {
        return compDataValue.get.call(this);
    }

    /**
     * Set the datavalue of an array component.
     */
    public set dataValue(value: any) {
        // Only set the value if it is an array.
        if (Array.isArray(value)) {
            // Get the current data value.
            const dataValue = this.dataValue;

            // Add additional rows.
            if (value.length > dataValue.length) {
                for (let i = dataValue.length; i < value.length; i++) {
                    this.addRow(value[i]);
                }
            }
            // Remove superfluous rows.
            if (dataValue.length > value.length) {
                for (let i = value.length; i < dataValue.length; i++) {
                    this.removeRow(i);
                }
            }
            // Set the new data value.
            value.forEach((rowData: any, index: number) => this.setRowData(rowData, index));
        }
    }
}