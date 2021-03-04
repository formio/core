declare const _default: {
    type: string;
    extends: string;
    schema: {
        tag: string;
        content: string;
        attrs: never[];
        className: string;
    };
    template: (ctx: any) => string;
    methods: {
        getAttributes(): string;
        renderContext(_super: any): any;
    };
};
export default _default;
