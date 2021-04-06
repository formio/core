export declare function NestedArrayModel(Factory: any): (props?: any) => {
    new (component?: any, options?: any, data?: any): {
        /**
         * The rows for this component. Each row contains new instances of components.
         */
        rows: Array<Array<any>>;
        readonly defaultValue: never[];
        /**
         * Returns a row of componments at the provided index.
         * @param index The index of the row to return
         */
        row(index: number): Array<any>;
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
         * Creates all components for each row.
         * @param data
         * @returns
         */
        createComponents(data: any): Array<any>;
        /**
         * Creates a new row of components.
         *
         * @param data The data context to pass along to this row of components.
         */
        createRowComponents(data: any, index?: number): Array<any>;
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
        readonly emptyValue: any;
        /**
         * Returns the dataValue for this component.
         */
        dataValue: any;
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
        componentData(): any;
        components: any[];
        init(): void;
        createComponent(component: any, options: any, data: any): any;
        removeComponent(component: any): void;
        eachComponent(fn: Function): void;
        eachComponentValue(value: any, fn: any): void;
        id: string;
        parent: any;
        root: any;
        events: import("eventemitter3")<string | symbol, any>;
        component: any;
        options: any;
        data: any;
        readonly defaultOptions: any;
        readonly defaultSchema: any;
        isEmpty(value?: any): boolean;
        updateValue(value: any): boolean;
        getValue(): any;
        hook(name: string, ...args: any): any;
        bubble(event: any, ...args: any): any;
        emit(event: any, ...args: any): any;
        on(event: any, fn: any, ...args: any): import("eventemitter3")<string | symbol, any>;
        once(event: any, fn: any, ...args: any): import("eventemitter3")<string | symbol, any>;
        off(event: any, ...args: any): import("eventemitter3")<string | symbol, any>;
    };
    schema(): any;
};
