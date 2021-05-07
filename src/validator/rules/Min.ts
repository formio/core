import { Rule } from './Rule';
import { isNaN } from '@formio/lodash';
export class MinRule extends Rule {
  defaultMessage = '{{ field }} cannot be less than {{ settings }}.';
  public async check(value: any = this.component.dataValue) {
    const min = parseFloat(this.settings);
    const parsedValue = parseFloat(value);
    if (isNaN(min) || isNaN(parsedValue)) {
      return true;
    }
    return parsedValue >= min;
  }
};
