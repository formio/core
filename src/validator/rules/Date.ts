import { Rule } from './Rule';
export class DateRule extends Rule {
  defaultMessage = '{{field}} is not a valid date.';
  public async check(value: any = this.component.dataValue) {
    if (!value || value instanceof Date) {
      return true;
    }
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'invalid date') {
        return false;
      }
      value = new Date(value);
    }
    return value.toString() !== 'Invalid Date';
  }
};
