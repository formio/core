import { Rule } from './Rule';
export class RequiredRule extends Rule {
  defaultMessage = '{{ field }} is required';
  public async check(value: any = this.component.dataValue) {
    return !this.component.isEmpty(value);
  }
};
