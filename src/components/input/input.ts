import { Components } from '../../core/Components';
import { Component } from '../../core/component/Component';
import { HTMLComponent, HTMLProperties } from '../html/html';

@Component({
    type: 'input',
    template: HTMLProperties.template,
    schema: {
        ...HTMLProperties.schema,
        ...{
            tag: 'input',
            ref: 'input',
            changeEvent: 'input',
            inputType: 'text'
        }
    }
})
export class InputComponent extends HTMLComponent {
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
        this.addEventListener(this.element, this.component.changeEvent, this.onInput.bind(this));
        return this;
    }
    detach() {
        this.removeEventListener(this.element, this.component.changeEvent, this.onInput.bind(this));
    }
    setValue(value: any) {
        if (this.element) {
            this.element.value = value;
        }
    }
}
Components.addComponent(InputComponent, 'input');