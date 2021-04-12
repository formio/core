import { Rule } from './Rule';
export declare class MaxLengthRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
