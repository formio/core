export declare function NestedDataModel(Factory: any): (props?: any) => {
    new (component?: any, options?: any, data?: any): {
        readonly emptyValue: any;
        readonly defaultValue: {};
        /**
         * Get the component data.
         */
        componentData(): any;
        dataValue: any;
        components: any[];
        init(): void;
        createComponent(component: any, options: any, data: any): any;
        createComponents(data: any): any[];
        removeComponent(component: any): void;
        eachComponent(fn: Function): void;
        eachComponentValue(value: any, fn: any): void;
        setValue(value: any): boolean;
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
        hasChanged(value: any): boolean;
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
