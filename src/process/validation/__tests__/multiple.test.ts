import { expect } from 'chai';
import { ValidationContext } from 'types';
import { validationRules } from '..';
import { rules, serverRules } from '../rules';
import { shouldValidate as shouldValidateRegexPattern } from '../rules/validateRegexPattern';

const allRules = [...rules, ...serverRules];

const textFiledComponent = {
    type: 'textfield',
    key: 'multiple_textfield',
    label: 'Multiple Textfield',
    input: true,
    multiple: true,
    validate: {
        required: true,
        maxLength: 10,
        minLength: 5,
        pattern: '^[0-9]+$',
    }
};
const selectComponent = {
    type: 'select',
    key: 'multiple_select',
    label: 'Multiple Select',
    widget: 'choicesjs',
    input: true,
    multiple: true,
    data: {
        values: [
            {
                label: 'A',
                value: 'a',
            },
            {
                label: 'B',
                value: 'b',
            },
            {
                label: 'C',
                value: 'c',
            },
        ],
    },
    validate: {
        required: true,
    }
};

const context: ValidationContext = {
    component: textFiledComponent,
    value: [],
    path: 'multiple_textfield',
    data: {multiple_textfield: []},
    row: {multiple_textfield: []},
    scope: {errors: []},
};

const contextWithSelectComponent: ValidationContext = {
    component: selectComponent,
    value: [],
    path: 'multiple_select',
    data: {multiple_select: []},
    row: {multiple_select: []},
    scope: {errors: []},
};

it('Validating required rule will work for multiple values component with no rows', async () => {
    // TextField
    const fullValueRules = allRules.filter((rule) => rule.fullValue);
    const rulesToValidate = validationRules(context, fullValueRules, undefined);
    expect(rulesToValidate).to.not.have.length(0);
    // Select
    const fullValueRulesSelect = allRules.filter((rule) => rule.fullValue);
    const rulesToValidateSelect = validationRules(contextWithSelectComponent, fullValueRulesSelect, undefined);
    expect(rulesToValidateSelect).to.not.have.length(0);
});

it('Validate RegexPattern rule won\'t execute for multiple values component with no rows', async () => {
    const shouldValidateRegexRule = shouldValidateRegexPattern(context);
    expect(shouldValidateRegexRule).to.be.equal(false);

    const contextWithValues = {
        ...context,
        value: ['a'],
        data: {
            multiple_textfield: ['a'],
        },
        row: {
            multiple_textfield: ['a'],
        },
    };
    const shouldValidateRegexRuleWithValues = shouldValidateRegexPattern(contextWithValues);
    expect(shouldValidateRegexRule).to.be.equal(true);
});
