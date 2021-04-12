import { Rule } from './Rule';
export declare class RequiredRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
