import { Rule } from './Rule';
export declare class MaskRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
