export class Rule {
  constructor(public component?: any, public settings?: any, public config?: any) {}
  public async check(value: any = this.component.dataValue, data?: any, row?: any): Promise<boolean> {
    return false;
  }
}
