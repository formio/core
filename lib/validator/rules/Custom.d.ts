import { Rule } from './Rule';
export declare class CustomRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<any>;
}
