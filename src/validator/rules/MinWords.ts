import { Rule } from './Rule';
export class MinWordsRule extends Rule {
  defaultMessage = '{{field}} must have at least {{- settings.length}} words.';
  public async check(value: any = this.component.dataValue) {
    const minWords = parseInt(this.settings.length, 10);
    if (!minWords || !value || (typeof value !== 'string')) {
      return true;
    }
    return (value.trim().split(/\s+/).length >= minWords);
  }
};
