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
export class Validator {
    public rules: any = {};
    public errors: any = [];
    public static rules: any = {};
    public static addRules(rules: any) {
        Validator.rules = { ...Validator.rules, ...rules };
    }

    public static fromComponent(component: any) {
        const rules = component.component.validate || {};

        // These validations are outside of validate object.
        if (component.component.unique) {
            rules.unique = true;
        }

        return new this(component, rules);
    }

    constructor(public component: any, public ruleOptions: any) {
        // Iterate over all the rules and create the rule instances.
        for (let ruleName in ruleOptions) {
            if (ruleOptions.hasOwnProperty(ruleName)) {
                this.addRule(ruleName, ruleOptions[ruleName]);
            }
        }
    }

    public addRule(name: string, settings: any) {
        if (!!settings && Validator.rules.hasOwnProperty(name)) {
            this.rules[name] = new Validator.rules[name](this.component, settings);
        }
    }

    public removeRule(name: string) {
        if (this.rules.hasOwnProperty(name)) {
            delete this.rules[name];
        }
    }

    public async check(value: any = this.component.dataValue, config: any = {}) {
        this.errors = [];
        if (this.component.isValueRedacted()) {
            return true;
        }
        for (let ruleName in this.rules) {
            if (this.rules.hasOwnProperty(ruleName)) {
                const rule = this.rules[ruleName];
                const isValid = await rule.check(value, config);
                if (isValid !== true) {
                    const { component } = this.component;
                    this.errors.push({
                        type: ruleName,
                        settings: rule.settings,
                        message: this.component.interpolate(rule.defaultMessage, {
                            error: isValid,
                            settings: rule.settings,
                            field: component.label || component.title || component.key
                        })
                    });
                }
            }
        }
        return this.errors.length === 0;
    }

    public getErrorInfo() {
        return this.errors.length ? {
            component: this.component.component,
            value: this.component.dataValue,
            errors: this.errors
        } : null;
    }
};