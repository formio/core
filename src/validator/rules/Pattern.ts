import { Rule } from './Rule';
export class PatternRule extends Rule {
  defaultMessage = '{{ field }} does not match the pattern {{ settings }}';
  public async check(value: any = this.component.dataValue) {
    return (new RegExp(`^${this.settings}$`)).test(value);
  }
};
