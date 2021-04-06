export declare function NestedModel(Factory: any): (props?: any) => {
    new (component?: any, options?: any, data?: any): {
        components: Array<any>;
        /**
         * Initialize the nested entity by creating the children.
         */
        init(): void;
        /**
         * Get the component data.
         * @returns
         */
        componentData(): any;
        /**
         * Creates a new component entity.
         * @param component
         * @param options
         * @param data
         * @returns
         */
        createComponent(component: any, options: any, data: any): any;
        /**
         * Creates the components.
         * @param data
         * @returns
         */
        createComponents(data: any): Array<any>;
        /**
         * Removes a child comopnent.
         * @param component
         */
        removeComponent(component: any): void;
        /**
         * Get the default value for this nested entity.
         */
        readonly defaultValue: {};
        /**
         * The empty value for this component.
         *
         * @return {null}
         */
        readonly emptyValue: any;
        /**
         * Get the datavalue of this component.
         */
        dataValue: any;
        /**
         * Perform an iteration over each component within this container component.
         *
         * @param {function} fn - Called for each component
         */
        eachComponent(fn: Function): void;
        /**
         * Iterate through each component value.
         *
         * @param value The context data value.
         * @param fn Callback to be called with the component and the value for that component.
         */
        eachComponentValue(value: any, fn: any): void;
        /**
         * Sets the value for a data component.
         *
         * @param value
         */
        setValue(value: any): boolean;
        id: string;
        parent: any;
        root: any;
        events: import("eventemitter3")<string | symbol, any>; /**
         * Get the component data.
         * @returns
         */
        component: any;
        options: any;
        data: any;
        readonly defaultOptions: any;
        readonly defaultSchema: any;
        isEmpty(value?: any): boolean;
        hasChanged(value: any): boolean;
        updateValue(value: any): boolean; /**
         * Iterate through each component value.
         *
         * @param value The context data value.
         * @param fn Callback to be called with the component and the value for that component.
         */
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
