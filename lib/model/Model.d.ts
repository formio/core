import EventEmitterBase from 'eventemitter3';
export declare function Model(props?: any): {
    new (component?: any, options?: any, data?: any): {
        /**
         * A random generated ID for this entity.
         */
        id: string;
        /**
         * The parent entity.
         */
        parent: any;
        /**
         * The root entity.
         */
        root: any;
        /**
         * The events to fire for this model.
         */
        events: EventEmitterBase;
        component: any;
        options: any;
        data: any;
        readonly defaultOptions: any;
        readonly defaultSchema: any;
        /**
         * Initializes the entity.
         */
        init(): void;
        /**
         * The empty value for this component.
         *
         * @return {null}
         */
        readonly emptyValue: any;
        /**
         * Checks to see if this components value is empty.
         *
         * @param value
         * @returns
         */
        isEmpty(value?: any): boolean;
        /**
         * Returns the data value for this component.
         */
        dataValue: any;
        /**
         * Determine if this component has changed values.
         *
         * @param value - The value to compare against the current value.
         */
        hasChanged(value: any): boolean;
        /**
         * Updates the data model value
         * @param value The value to update within this component.
         * @return boolean true if the value has changed.
         */
        updateValue(value: any): boolean;
        /**
         * Get the model value.
         * @returns
         */
        getValue(): any;
        /**
         * Allow for options to hook into the functionality of this entity.
         * @return {*}
         */
        hook(name: string, ...args: any): any;
        bubble(event: any, ...args: any): any;
        emit(event: any, ...args: any): any;
        on(event: any, fn: any, ...args: any): EventEmitterBase<string | symbol, any>;
        once(event: any, fn: any, ...args: any): EventEmitterBase<string | symbol, any>;
        off(event: any, ...args: any): EventEmitterBase<string | symbol, any>;
    };
    /**
     * The default JSON schema
     * @param extend
     */
    schema(): any;
};
