declare const _default: {
    type: string;
    extends: string;
    schema: {
        tag: string;
        ref: string;
        changeEvent: string;
        inputType: string;
    };
    methods: {
        getAttributes(_super: any): string;
        onInput(): void;
        attach(_super: any, element: HTMLElement): Promise<any>;
        detach(_super: any): void;
        setValue(_super: any, value: any): any;
    };
};
export default _default;
