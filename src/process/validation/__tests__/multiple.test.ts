import { assert, expect } from 'chai';
import { ValidationContext, ValidationScope } from 'types';
import { shouldValidate as shouldValidateRegexPattern } from '../rules/validateRegexPattern';
import { shouldValidate as shouldValidateRequired } from '../rules/validateRequired';
import { processSync, ProcessTargets } from 'processes';

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

  it('Should return only a single require error message for File component with Multiple Values and require', async function () {
    const form = {
      components: [
        {
          label: 'Upload',
          tableView: false,
          storage: 'base64',
          webcam: false,
          capture: false,
          fileTypes: [
            {
              label: '',
              value: '',
            },
          ],
          multiple: true,
          validate: {
            required: true,
          },
          validateWhenHidden: false,
          key: 'file',
          type: 'file',
          input: true,
        },
      ],
    };

    const submission = {
      data: {
        file: [],
      },
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: { errors },
      config: {},
    };
    processSync(context);
    expect((context.scope as ValidationScope).errors).to.have.length(1);
    assert.equal(context.scope.errors[0].ruleName, 'required');
  });
});
