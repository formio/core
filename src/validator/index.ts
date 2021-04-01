import rules from './rules';
export class Validator {
    public static rules: any = rules;
    public static addRules(rules: any) {
        Validator.rules = { ...Validator.rules, ...rules };
    }
};