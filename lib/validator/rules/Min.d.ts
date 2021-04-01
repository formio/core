import { Rule } from './Rule';
export declare class MinRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
