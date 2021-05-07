import { Rule } from './Rule';
import { boolValue } from '@formio/utils/utils';
export class OnlyAvailableRule extends Rule {
  defaultMessage = '{{ field }} is an invalid value.';
  public async check(value: any = this.component.dataValue) {
    return !boolValue(value);
  }
};