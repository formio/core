import { Components } from '../../core/Components';
import { HTMLComponentBase } from '../html/html';
export class InputComponent extends HTMLComponentBase({
    type: 'input',
    schema: {
        tag: 'input',
        ref: 'input',
        changeEvent: 'input',
        inputType: 'text'
    }
}) {
    public element: any;
    getAttributes() {
        const attributes = super.getAttributes();
        const inputName = `${this.component.type}-${this.component.key}`.toLowerCase().replace(/[^a-z0-9\-]+/g, '_');
        return ` type="${(this as any).component.inputType}" id="${inputName}" name="${inputName}"${attributes}`;
    }
    onInput() {
        this.updateValue(this.element.value);
    }
    async attach(element: HTMLElement) {
        await super.attach(element);
        this.addEventListener(this.element, this.component.changeEvent, this.onInput.bind(this));
        return this;
    }
    detach() {
        this.removeEventListener(this.element, this.component.changeEvent, this.onInput.bind(this));
        super.detach();
    }
    setValue(value: any) {
        if (this.element) {
            this.element.value = value;
        }
        return super.setValue(value);
    }
}
Components.addComponent(InputComponent);