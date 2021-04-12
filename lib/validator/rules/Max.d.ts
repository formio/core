import { Rule } from './Rule';
export declare class MaxRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
