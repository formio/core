import { Rule } from './Rule';
export class CustomRule extends Rule {
  defaultMessage = '{{ error }}';
  public async check(value: any = this.component.dataValue) {
    const custom = this.settings;
    if (!custom) {
      return true;
    }

    const valid = this.component.evaluate(custom, {
      valid: true,
      input: value,
    }, 'valid', true);

    if (valid === null) {
      return true;
    }

    return valid;
  }
};
