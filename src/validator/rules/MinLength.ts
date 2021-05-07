import { Rule } from './Rule';
export class MinLengthRule extends Rule {
  defaultMessage = '{{ field }} must have no more than {{ settings }} characters.';
  public async check(value: any = this.component.dataValue) {
    const minLength = parseInt(this.settings, 10);
    if (!minLength || !value || !value.hasOwnProperty('length') || this.component.isEmpty(value)) {
      return true;
    }
    return (value.length >= minLength);
  }
};
