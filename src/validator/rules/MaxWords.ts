import { Rule } from './Rule';
export class MaxWordsRule extends Rule {
  defaultMessage = '{{field}} must have no more than {{- settings.length}} words.';
  public async check(value: any = this.component.dataValue) {
    const maxWords = parseInt(this.settings.length, 10);
    if (!maxWords || (typeof value !== 'string')) {
      return true;
    }
    return (value.trim().split(/\s+/).length <= maxWords);
  }
};