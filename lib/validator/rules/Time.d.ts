import { Rule } from './Rule';
export declare class TimeRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
