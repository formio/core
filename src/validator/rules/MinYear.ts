import { Rule } from './Rule';
export class MinYearRule extends Rule {
  defaultMessage = '{{field}} should not contain year less than {{minYear}}';
  public async check(value: any = this.component.dataValue) {
    const minYear = this.settings;
    let year: any = /\d{4}$/.exec(value);
    year = year ? year[0] : null;

    if (!year || !(+minYear) || !(+year)) {
      return true;
    }

    return +year >= +minYear;
  }
};
