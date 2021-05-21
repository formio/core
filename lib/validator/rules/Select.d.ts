import { Rule } from './Rule';
export declare class SelectRule extends Rule {
    defaultMessage: string;
    check(value?: any, options?: any): Promise<boolean>;
}
