import { Rule } from './Rule';
export declare class JSONRule extends Rule {
    defaultMessage: string;
    check(value: any, data: any, row: any, index?: number): Promise<any>;
}
