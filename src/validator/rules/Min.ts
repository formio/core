import { Rule } from './Rule';
import { isNaN } from '@formio/lodash';
export class MinRule extends Rule {
  defaultMessage = '{{field}} cannot be less than {{settings.limit}}.';
  public async check(value: any = this.component.dataValue) {
    const min = parseFloat(this.settings.limit);
    const parsedValue = parseFloat(value);
    if (isNaN(min) || isNaN(parsedValue)) {
      return true;
    }
    return parsedValue >= min;
  }
};
