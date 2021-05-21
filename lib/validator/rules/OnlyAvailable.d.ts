import { Rule } from './Rule';
export declare class OnlyAvailableRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
