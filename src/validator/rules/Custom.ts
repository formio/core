import { Rule } from './Rule';
export class CustomRule extends Rule {
  defaultMessage = '{{error}}';
  public async check(value: any = this.component.dataValue, data?: any, row?: any, index?: number) {
    const custom = this.settings.custom;
    if (!custom) {
      return true;
    }

    const valid = this.component.evaluate(custom, {
      valid: true,
      data,
      row,
      rowIndex: index,
      input: value,
    }, 'valid', true);

    if (valid === null) {
      return true;
    }

    return valid;
  }
};
