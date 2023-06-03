"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
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
class Validator {
    static addRules(rules) {
        Validator.rules = Object.assign(Object.assign({}, Validator.rules), rules);
    }
    static fromComponent(component) {
        const rules = component.component.validate || {};
        // These validations are outside of validate object.
        if (component.component.unique) {
            rules.unique = true;
        }
        return new this(component, rules);
    }
    constructor(component, ruleOptions) {
        this.component = component;
        this.ruleOptions = ruleOptions;
        this.rules = {};
        this.errors = [];
        // Iterate over all the rules and create the rule instances.
        for (let ruleName in ruleOptions) {
            if (ruleOptions.hasOwnProperty(ruleName)) {
                this.addRule(ruleName, ruleOptions[ruleName]);
            }
        }
    }
    addRule(name, settings) {
        if (!!settings && Validator.rules.hasOwnProperty(name)) {
            this.rules[name] = new Validator.rules[name](this.component, settings);
        }
    }
    removeRule(name) {
        if (this.rules.hasOwnProperty(name)) {
            delete this.rules[name];
        }
    }
    check(value = this.component.dataValue, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.errors = [];
            if (this.component.isValueRedacted()) {
                return true;
            }
            for (let ruleName in this.rules) {
                if (this.rules.hasOwnProperty(ruleName)) {
                    const rule = this.rules[ruleName];
                    const isValid = yield rule.check(value, config);
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
        });
    }
    getErrorInfo() {
        return this.errors.length ? {
            component: this.component.component,
            value: this.component.dataValue,
            errors: this.errors
        } : null;
    }
}
exports.Validator = Validator;
Validator.rules = {};
;
