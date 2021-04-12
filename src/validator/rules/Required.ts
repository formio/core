import { Rule } from './Rule';
export class RequiredRule extends Rule {
  defaultMessage = '{{field}} is required';
  public async check(value: any = this.component.dataValue) {
    if (!this.settings.required || this.component.isValueRedacted()) {
      return true;
    }

    return !this.component.isEmpty(value);
  }
};
