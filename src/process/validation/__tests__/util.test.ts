import { get } from 'lodash';
import { expect } from 'chai';
import { interpolateErrors } from '../util';
import { validateProcess } from '../';
import {
  simpleCustomValidationForm,
  simpleForm,
  simpleJsonLogicValidationForm,
  simpleNestedForm,
} from './fixtures/forms';
import { ValidationScope, ProcessorType } from 'types';
import { rules } from '../rules';
import { eachComponentDataAsync } from 'utils/formUtil';

describe('interpolateErrors', function () {
  it('Interpolated validation errors should include the rule name mapping in the "validator" param for simple components', async function () {
    const data = {
      requiredField: '',
      maximumWords:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      minimumWords: 'Hello',
      email: 'brendanb',
      url: 'htpigoogle',
      inputMask: 'hello, world',
      submit: false,
    };
    const result: Map<string, ReturnType<typeof interpolateErrors>> = new Map();
    for (const component of simpleForm.components) {
      const path = component.key;
      const scope: ValidationScope = { errors: [] };
      await validateProcess({
        component,
        scope,
        data,
        row: data,
        path,
        value: get(data, component.key),
        processor: ProcessorType.Validate,
        rules,
      });
      result.set(path, interpolateErrors(scope.errors));
    }
    expect(result.get('requiredField')).to.have.length(1);
    expect(result.get('requiredField')![0].context.validator).to.equal('required');
    expect(result.get('maximumWords')).to.have.length(1);
    expect(result.get('maximumWords')![0].context.validator).to.equal('maxWords');
    expect(result.get('minimumWords')).to.have.length(1);
    expect(result.get('minimumWords')![0].context.validator).to.equal('minWords');
    expect(result.get('email')).to.have.length(1);
    expect(result.get('email')![0].context.validator).to.equal('email');
    expect(result.get('url')).to.have.length(1);
    expect(result.get('url')![0].context.validator).to.equal('url');
    expect(result.get('inputMask')).to.have.length(1);
    expect(result.get('inputMask')![0].context.validator).to.equal('mask');
  });

  it('Interpolated validation errors should include the rule name mapping in the "validator" param for nested components', async function () {
    const data = {
      dataGrid: [
        {
          requiredField: '',
          maximumLength:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          numbersOnly: 'abc',
          submit: false,
        },
        {
          requiredField: '',
          maximumLength:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          numbersOnly: 'abc',
          submit: false,
        },
      ],
    };
    const result: Map<string, ReturnType<typeof interpolateErrors>> = new Map();
    await eachComponentDataAsync(
      simpleNestedForm.components,
      data,
      async (component, data, row, path) => {
        const scope: ValidationScope = { errors: [] };
        await validateProcess({
          component,
          scope,
          data,
          row: data,
          path,
          value: get(data, path),
          processor: ProcessorType.Validate,
          rules,
        });
        result.set(path, interpolateErrors(scope.errors));
      },
    );
    expect(result.get('dataGrid[0].requiredField')).to.have.length(1);
    expect(result.get('dataGrid[0].requiredField')![0].context.validator).to.equal('required');
    expect(result.get('dataGrid[1].requiredField')).to.have.length(1);
    expect(result.get('dataGrid[1].requiredField')![0].context.validator).to.equal('required');
    expect(result.get('dataGrid[0].maximumLength')).to.have.length(1);
    expect(result.get('dataGrid[0].maximumLength')![0].context.validator).to.equal('maxLength');
    expect(result.get('dataGrid[1].maximumLength')).to.have.length(1);
    expect(result.get('dataGrid[1].maximumLength')![0].context.validator).to.equal('maxLength');
    expect(result.get('dataGrid[0].numbersOnly')).to.have.length(1);
    expect(result.get('dataGrid[0].numbersOnly')![0].context.validator).to.equal('pattern');
  });

  it('Interpolated validation errors should include the rule name mapping in the "validator" param for components with custom validation', async function () {
    const data = {
      customValidation: 'abc',
      submit: false,
    };
    const result: Map<string, ReturnType<typeof interpolateErrors>> = new Map();
    for (const component of simpleCustomValidationForm.components) {
      const path = component.key;
      const scope: ValidationScope = { errors: [] };
      await validateProcess({
        component,
        scope,
        data,
        row: data,
        path,
        value: get(data, component.key),
        processor: ProcessorType.Validate,
        rules,
      });
      result.set(path, interpolateErrors(scope.errors));
    }
    expect(result.get('customValidation')).to.have.length(1);
    expect(result.get('customValidation')![0].context.validator).to.equal('custom');
  });

  it('Interpolated validation errors should include the rule name mapping in the "validator" param for components with json logic validation', async function () {
    const data = {
      jsonLogic: 'abc',
      submit: false,
    };
    const result: Map<string, ReturnType<typeof interpolateErrors>> = new Map();
    for (const component of simpleJsonLogicValidationForm.components) {
      const path = component.key;
      const scope: ValidationScope = { errors: [] };
      await validateProcess({
        component,
        scope,
        data,
        row: data,
        path,
        value: get(data, component.key),
        processor: ProcessorType.Validate,
        rules,
      });
      result.set(path, interpolateErrors(scope.errors));
    }
    expect(result.get('jsonLogic')).to.have.length(1);
    expect(result.get('jsonLogic')![0].context.validator).to.equal('json');
  });
});
