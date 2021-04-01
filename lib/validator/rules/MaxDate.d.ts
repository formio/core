import { Rule } from './Rule';
export declare class MaxDateRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
