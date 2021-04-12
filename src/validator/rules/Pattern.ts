import { Rule } from './Rule';
export class PatternRule extends Rule {
  defaultMessage = '{{field}} does not match the pattern {{settings.pattern}}';
  public async check(value: any = this.component.dataValue) {
    const { pattern } = this.settings;
    if (!pattern) {
      return true;
    }

    return (new RegExp(`^${pattern}$`)).test(value);
  }
};
