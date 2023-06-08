import { RuleFn, Component } from 'types';
import { ValidatorConfig } from '../types/ValidatorConfig';
import { FieldError } from '../error/FieldError';
import { rules as allRules } from './rules';
import { shouldSkipValidation } from './util';
import { Evaluator } from 'utils';

export class Validator {
    rules: RuleFn[];
    config: ValidatorConfig;

    constructor(
        component: Component,
        rules: RuleFn[] = allRules,
        config: ValidatorConfig = { evaluator: Evaluator }
    ) {
        this.rules = rules;
        this.config = config;
    }

    async process({component, data, rules, config}: {component: Component, data: Record<string, any>, rules: RuleFn[], config?: ValidatorConfig}): Promise<FieldError[]> {
        if (shouldSkipValidation(component)) {
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
