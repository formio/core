import { get } from 'lodash';
import { ModelInterface, ModelDecoratorInterface } from './Model';
import { NestedDataModel } from './NestedDataModel';
export function NestedArrayModel(props: any = {}): ModelDecoratorInterface {
  return function (BaseClass?: ModelInterface): ModelInterface {
    return class BaseNestedArrayModel extends NestedDataModel(props)(BaseClass) {
      /**
       * The rows for this component. Each row contains new instances of components.
       */
      public rows!: Array<Array<any>>;
      get defaultValue() {
        return [];
      }

      /**
       * Returns a row of componments at the provided index.
       * @param index The index of the row to return
       */
      row(index: number): Array<any> {
        return index < this.rows.length ? this.rows[index] : [];
      }

      /**
       * Removes a row and detatches all components within that row.
       *
       * @param index The index of the row to remove.
       */
      removeRow(index: number) {
        this.row(index).forEach((comp: any) => this.removeComponent(comp));
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
        this.createRowComponents(rowData, index);
      }

      /**
       * Sets the data for a specific row of components.
       * @param rowData The data to set
       * @param index The index of the rows to set the data within.
       */
      setRowData(rowData: any, index: number) {
        this.dataValue[index] = rowData;
        this.row(index)?.forEach((comp: any) => (comp.data = rowData));
      }

      /**
       * Determines if the data within a row has changed.
       *
       * @param rowData
       * @param index
       */
      rowChanged(rowData: any, index: number): boolean {
        let changed = false;
        this.row(index)?.forEach((comp: any) => {
          const hasChanged: boolean = comp.hasChanged(get(rowData, comp.component.key));
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
      createComponents(data: any): Array<any> {
        this.rows = [];
        let added: Array<any> = [];
        this.eachRowValue(data, (row: any, index: number) => {
          added = added.concat(this.createRowComponents(row, index));
        });
        return added;
      }

      /**
       * Creates a new row of components.
       *
       * @param data The data context to pass along to this row of components.
       */
      createRowComponents(data: any, index: number = 0): Array<any> {
        const comps = super.createComponents(data, (comp: any) => {
          comp.rowIndex = index;
        });
        this.rows[index] = comps;
        return comps;
      }

      getIndexes(value: Array<any>) {
        if (super.getIndexes) {
          return super.getIndexes(value);
        }
        return {
          min: 0,
          max: value.length - 1,
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
        return this.component.key ? get(this.data, this.component.key) : this.data;
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
            this.setRowData(row, index);
          });

          // Remove superfluous rows.
          if (dataValue.length > value.length) {
            for (let i = dataValue.length - 1; i >= value.length; i--) {
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
        let changed = false;
        this.eachComponentValue(value, (comp: any, val: any) => {
          changed = comp.setValue(val) || changed;
        });
        return changed;
      }
    };
  };
}
