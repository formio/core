import { RuleFn, Component, ValidatorConfig } from 'types';
import { FieldError } from '../error/FieldError';
import { rules as allRules } from './rules';
import { shouldSkipValidation } from './util';
import { Evaluator } from 'utils';

export class Validator {
    rules: RuleFn[];
    config: ValidatorConfig;

    constructor(
        rules: RuleFn[] = allRules,
        config: ValidatorConfig = { evaluator: Evaluator }
    ) {
        this.rules = rules;
        this.config = config;
    }

    async process(component: Component, data: Record<string, any>): Promise<FieldError[]> {
        if (shouldSkipValidation(component)) {
            return [];
        }
        const errors: FieldError[] = [];
        for (const rule of this.rules) {
            const error = await rule(component, data, this.config);
            if (error) {
                errors.push(error);
            }
        }
        return errors;
    }
}
