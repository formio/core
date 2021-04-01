import { Rule } from './Rule';
export declare class UrlRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
