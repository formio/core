import { Rule } from './Rule';
export declare class MinDateRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
