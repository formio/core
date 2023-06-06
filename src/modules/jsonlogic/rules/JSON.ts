import { Rule } from 'validator';
export class JSONRule extends Rule {
  defaultMessage = '{{error}}';
  public async check(value: any = this.component.dataValue, data: any = {}, row: any = {}, index: number = 0) {
    const { json } = this.settings;

    if (!json) {
      return true;
    }

    const valid = this.component.evaluate(json, {
      data,
      row,
      rowIndex: index,
      input: value
    });

    if (valid === null) {
      return true;
    }

    return valid;
  }
};
