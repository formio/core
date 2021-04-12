import { Rule } from './Rule';
export declare class MinWordsRule extends Rule {
    defaultMessage: string;
    check(value?: any): Promise<boolean>;
}
