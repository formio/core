import { Rule } from './Rule';
export declare class MinYearRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
