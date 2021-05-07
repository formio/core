import { Rule } from './Rule';
export class MaxLengthRule extends Rule {
  defaultMessage = '{{ field }} must have no more than {{ settings }} characters.';
  public async check(value: any = this.component.dataValue) {
    const maxLength = parseInt(this.settings, 10);
    if (!value || !maxLength || !value.hasOwnProperty('length')) {
      return true;
    }
    return (value.length <= maxLength);
  }
};
