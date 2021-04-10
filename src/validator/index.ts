import Rules from './rules';
export class Validator {
    public static rules: any = Rules;
    public static addRules(rules: any) {
        Validator.rules = { ...Validator.rules, ...rules };
    }
};

export { Rules };
export { Rule } from './rules/Rule';