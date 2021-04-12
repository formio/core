import { Rule } from './Rule';
export declare class MaxYearRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
