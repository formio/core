import { Rule } from './Rule';
export declare class DayRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
