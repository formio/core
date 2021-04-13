import { Rule } from './Rule';
export declare class SelectRule extends Rule {
    defaultMessage: string;
    check(value: any, data: any, row: any, async?: any): Promise<boolean>;
}
