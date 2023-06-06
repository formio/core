import { RuleFn, Component } from '../types';
import { ValidatorConfig } from '../types/ValidatorConfig';
import { FieldError } from '../error/FieldError';
import { rules as allRules } from './rules';
import { shouldSkipValidation } from './util';

export class Validator {
    rules: RuleFn[];
    component: Component;
    config: ValidatorConfig;

    constructor(
        component: Component,
        rules: RuleFn[] = allRules,
        config: ValidatorConfig = {}
    ) {
        this.component = component;
        this.rules = rules;
        this.config = config;
    }

    async process(data: Record<string, any>): Promise<FieldError[]> {
        if (shouldSkipValidation(this.component)) {
            return [];
        }
        const errors: FieldError[] = [];
        for (const rule of this.rules) {
            const error = await rule(this.component, data, this.config);
            if (error) {
                errors.push(error);
            }
        }
        return errors;
    }
}
