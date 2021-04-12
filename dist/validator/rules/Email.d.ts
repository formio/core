import { Rule } from './Rule';
export declare class EmailRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
