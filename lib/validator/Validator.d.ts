/**
 * Create a new component data validator.
 *
 * const validator = new Validator(component, {
 *   required: true,
 *   pattern: '[0-9]+',
 *   minLength: 10,
 *   maxLength: 20
 * });
 * const isValid = await validator.check();
 */
export declare class Validator {
    component: any;
    ruleOptions: any;
    rules: any;
    errors: any;
    static rules: any;
    static addRules(rules: any): void;
    static fromComponent(component: any): Validator;
    constructor(component: any, ruleOptions: any);
    addRule(name: string, settings: any): void;
    removeRule(name: string): void;
    check(value?: any, config?: any): Promise<boolean>;
    getErrorInfo(): {
        component: any;
        value: any;
        errors: any;
    } | null;
}
