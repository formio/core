declare const InputComponent_base: import("../../core/component/Component").ComponentInterface;
export declare class InputComponent extends InputComponent_base {
    element: any;
    getAttributes(): string;
    onInput(): void;
    attach(element: HTMLElement): Promise<this>;
    detach(): void;
    setValue(value: any): any;
}
export {};
