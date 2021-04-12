import { HTML } from '../html/html';
/**
 * Base Input component for extending purposes.
 */
export declare class Input extends HTML {
    element: any;
    getAttributes(): string;
    onInput(): void;
    attach(element: HTMLElement): Promise<this>;
    detach(): void;
    setValue(value: any): void;
}
export declare class InputComponent extends Input {
}
