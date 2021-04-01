import { Rule } from './Rule';
export class MaxYearRule extends Rule {
  defaultMessage = '{{field}} should not contain year greater than {{maxYear}}';
  public async check(value: any = this.component.dataValue) {
    const maxYear = this.settings;
    let year: any = /\d{4}$/.exec(value);
    year = year ? year[0] : null;
    if (!(+maxYear) || !(+year)) {
      return true;
    }
    return +year <= +maxYear;
  }
};
