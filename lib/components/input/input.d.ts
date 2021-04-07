import { HTMLComponent } from '../html/html';
export declare class InputComponent extends HTMLComponent {
    element: any;
    getAttributes(): string;
    onInput(): void;
    attach(element: HTMLElement): Promise<this>;
    detach(): void;
    setValue(value: any): void;
}
