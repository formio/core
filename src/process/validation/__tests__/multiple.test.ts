import { expect } from 'chai';
import { validationRules } from '..';
import { rules, serverRules } from '../rules';

const allRules = [...rules, ...serverRules];

const component = {
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

const context = {
    component,
    value: [],
    path: 'multiple_textfield',
    data: {multiple_textfield: []},
    row: {multiple_textfield: []},
    scope: {errors: []},
    parentState: {hide: false, narrow: false}
};

it('Validating required rule will work for multiple values component with no rows', async () => {
    const fullValueRules = allRules.filter((rule) => rule.fullValue);
    const rulesToValidate = validationRules(context, fullValueRules, undefined);
    expect(rulesToValidate).to.not.have.length(0);
});

it('Validati olther rules will skip for multiple values component with no rows', async () => {
    const otherRules = allRules.filter((rule) => !rule.fullValue);
    const rulesToValidate = validationRules(context, otherRules, undefined);
    expect(rulesToValidate).to.have.length(0);
});
