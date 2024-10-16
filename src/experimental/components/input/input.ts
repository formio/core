import { Component } from '../../base';
import { HTML, HTMLProperties } from '../html';

/**
 * Base Input component for extending purposes.
 */
export class Input extends HTML {
  public element: any;
  getAttributes() {
    const attributes = super.getAttributes();
    const inputName = `${this.component.type}-${this.component.key}`
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '_');
    return ` type="${(this as any).component.inputType}" id="${inputName}" name="${inputName}"${attributes}`;
  }
  onInput() {
    this.updateValue(this.element.value);
  }
  async attach() {
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

@Component({
  type: 'input',
  template: HTMLProperties.template,
  schema: {
    ...HTMLProperties.schema,
    ...{
      tag: 'input',
      ref: 'input',
      changeEvent: 'input',
      inputType: 'text',
    },
  },
})
export class InputComponent extends Input {}
