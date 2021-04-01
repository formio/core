import { Rule } from './Rule';
export declare class CustomRule extends Rule {
    defaultMessage: string;
    check(value?: any, data?: any, row?: any, index?: number): Promise<any>;
}
