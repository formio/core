export class Rule {
  constructor(public component?: any, public settings?: any) {}
  public async check(value: any = this.component.dataValue, options: any = {}): Promise<boolean> {
    return false;
  }
}
