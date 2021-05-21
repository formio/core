import { Rule } from './Rule';
export declare class UniqueRule extends Rule {
    defaultMessage: string;
    check(value?: any, options?: any): Promise<any>;
}
