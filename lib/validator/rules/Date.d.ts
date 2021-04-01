import { Rule } from './Rule';
export declare class DateRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
