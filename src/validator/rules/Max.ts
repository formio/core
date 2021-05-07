import { Rule } from './Rule';
export class MaxRule extends Rule {
  defaultMessage = '{{ field }} cannot be greater than {{ settings }}.';
  public async check(value: any = this.component.dataValue) {
    const max = parseFloat(this.settings);
    const parsedValue = parseFloat(value);
    if (Number.isNaN(max) || Number.isNaN(parsedValue)) {
      return true;
    }
    return parsedValue <= max;
  }
};
