import { Rule } from './Rule';
export declare class PatternRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
