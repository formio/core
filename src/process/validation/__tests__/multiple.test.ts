import { expect } from 'chai';
import { ValidationContext } from 'types';
import { shouldValidate as shouldValidateRegexPattern } from '../rules/validateRegexPattern';
import { shouldValidate as shouldValidateRequired } from '../rules/validateRequired';

const textFieldComponent = {
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
  },
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
  },
};

const context: ValidationContext = {
  component: textFieldComponent,
  value: [],
  path: 'multiple_textfield',
  data: { multiple_textfield: [] },
  row: { multiple_textfield: [] },
  scope: { errors: [] },
};

const contextWithSelectComponent: ValidationContext = {
  component: selectComponent,
  value: [],
  path: 'multiple_select',
  data: { multiple_select: [] },
  row: { multiple_select: [] },
  scope: { errors: [] },
};

describe('Multiple values', function () {
  it('Validating required rule will work for multiple values component with no rows', async function () {
    // TextField
    const shouldValidateRequiredTextField = shouldValidateRequired(context);
    expect(shouldValidateRequiredTextField).to.be.equal(true);
    // Select
    const shouldValidateRequiredSelect = shouldValidateRequired(contextWithSelectComponent);
    expect(shouldValidateRequiredSelect).to.be.equal(true);
  });

  it("Validate RegexPattern rule won't execute for multiple values component with no rows", async function () {
    const shouldValidateRegexRule = shouldValidateRegexPattern(context);
    expect(shouldValidateRegexRule).to.be.equal(false);

    const contextWithValues = {
      ...context,
      value: 'a',
      data: {
        multiple_textfield: ['a'],
      },
      row: {
        multiple_textfield: ['a'],
      },
    };
    const shouldValidateRegexRuleWithValues = shouldValidateRegexPattern(contextWithValues);
    expect(shouldValidateRegexRuleWithValues).to.be.equal(true);
  });
});
