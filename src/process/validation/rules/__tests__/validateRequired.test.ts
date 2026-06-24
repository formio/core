import { expect } from 'chai';

import { FieldError } from 'error';
import { validateRequired } from '../validateRequired';
import {
  conditionallyHiddenRequiredHiddenField,
  hiddenRequiredField,
  requiredNonInputField,
  simpleTextField,
  simpleSelectBoxes,
  simpleRadioField,
  simpleCheckBoxField,
  requiredAddressManualMode,
} from './fixtures/components';
import { processOne } from 'processes/processOne';
import { generateProcessorContext } from './fixtures/util';
import { ProcessorsContext, SelectBoxesComponent, ValidationScope } from 'types';
import { validateProcessInfo } from 'processes/validation';
import { conditionProcessInfo } from 'processes/conditions';

describe('validateRequired', function () {
  it('Validating a simple component that is required and not present in the data will return a field error', async function () {
    const component = { ...simpleTextField, validate: { required: true } };
    const data = {};
    const context = generateProcessorContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result && result.errorKeyOrMessage).to.equal('required');
  });

  it('Validating a simple component that is required and present in the data will return null', async function () {
    const component = { ...simpleTextField, validate: { required: true } };
    const data = { component: 'a simple value' };
    const context = generateProcessorContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
  });

  it('Validating a simple component that is not required and present in the data will return null', async function () {
    const component = simpleTextField;
    const data = { component: 'a simple value' };
    const context = generateProcessorContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
  });

  it('Validating a simple component that is not required and not present in the data will return null', async function () {
    const component = simpleTextField;
    const data = {};
    const context = generateProcessorContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
  });

  it('Should validate a hidden component that does not contain data', async function () {
    const component = hiddenRequiredField;
    const data = { otherData: 'hideme' };
    const context = generateProcessorContext(component, data) as ProcessorsContext<ValidationScope>;
    context.processors = [validateProcessInfo];
    await processOne(context);
    expect(context.scope.errors.length).to.equal(1);
    expect(context.scope.errors[0] && context.scope.errors[0].errorKeyOrMessage).to.equal(
      'required',
    );
  });

  it('Should not validate a hidden component that is conditionally hidden', async function () {
    const component = conditionallyHiddenRequiredHiddenField;
    const data = { otherData: 'hideme' };
    const context = generateProcessorContext(component, data) as ProcessorsContext<ValidationScope>;
    context.processors = [conditionProcessInfo, validateProcessInfo];
    await processOne(context);
    expect(context.scope.errors.length).to.equal(0);
  });

  it('Should not validate a hidden component that has the hidden property set to true.', async function () {
    const component = hiddenRequiredField;
    component.hidden = true;
    const data = {};
    const context = generateProcessorContext(component, data) as ProcessorsContext<ValidationScope>;
    context.processors = [validateProcessInfo];
    await processOne(context);
    expect(context.scope.errors.length).to.equal(0);
  });

  it('Should validate a hidden component that has the `validateWhenHidden` property set to true.', async function () {
    const component = { ...hiddenRequiredField };
    component.validateWhenHidden = true;
    const data = {};
    const context = generateProcessorContext(component, data) as ProcessorsContext<ValidationScope>;
    context.processors = [validateProcessInfo];
    await processOne(context);
    expect(context.scope.errors.length).to.equal(1);
  });

  it('Validating a simple component that is required but conditionally hidden', async function () {
    const component = { ...simpleTextField };
    component.validate = { required: true };
    component.conditional = {
      show: false,
      when: 'otherData',
      eq: 'hideme',
    };
    const data = { otherData: 'hideme' };
    const context = generateProcessorContext(component, data) as ProcessorsContext<ValidationScope>;
    context.processors = [validateProcessInfo];
    await processOne(context);
    expect(context.scope.errors.length).to.equal(0);
  });

  it('Validating a simple component that is required but not persistent', async function () {
    const component = { ...simpleTextField };
    component.validate = { required: true };
    component.persistent = false;
    const data = { otherData: 'hideme' };
    const context = generateProcessorContext(component, data) as ProcessorsContext<ValidationScope>;
    context.processors = [validateProcessInfo];
    await processOne(context);
    expect(context.scope.errors.length).to.equal(0);
  });

  it('Validating a simple component that is required but persistent set to client-only', async function () {
    const component = { ...simpleTextField };
    component.validate = { required: true };
    component.persistent = 'client-only';
    const data = { otherData: 'hideme' };
    const context = generateProcessorContext(component, data) as ProcessorsContext<ValidationScope>;
    context.processors = [validateProcessInfo];
    await processOne(context);
    expect(context.scope.errors.length).to.equal(0);
  });

  it('Should not validate a non input comonent', async function () {
    const component = requiredNonInputField;
    const data = {};
    const context = generateProcessorContext(component, data) as ProcessorsContext<ValidationScope>;
    context.processors = [validateProcessInfo];
    await processOne(context);
    expect(context.scope.errors.length).to.equal(0);
  });

  it('Should validate a conditionally hidden component with validateWhenHidden flag set to true', async function () {
    const component = { ...simpleTextField };
    component.validate = { required: true };
    component.validateWhenHidden = true;
    component.conditional = {
      show: false,
      when: 'otherData',
      eq: 'hideme',
    };
    const data = { otherData: 'hideme' };
    const context = generateProcessorContext(component, data) as ProcessorsContext<ValidationScope>;
    context.processors = [validateProcessInfo];
    await processOne(context);
    expect(context.scope.errors.length).to.equal(1);
    expect(context.scope.errors[0] && context.scope.errors[0].errorKeyOrMessage).to.equal(
      'required',
    );
  });

  it('Validating a simple radio component that is required and present in the data with value set to false will return null', async function () {
    const component = {
      ...simpleRadioField,
      validate: { required: true },
      values: [
        {
          label: 'Yes',
          value: 'true',
        },
        {
          label: 'No',
          value: 'false',
        },
      ],
    };
    const data = { component: false };
    const context = generateProcessorContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
  });

  it('Validating a simple selectbox that is required and present in the data with value set to 0 will return null', async function () {
    const component = {
      ...simpleSelectBoxes,
      validate: { required: true },
      values: [
        {
          label: 'true',
          value: 'true',
        },
        {
          label: 'Null',
          value: '0',
        },
      ],
    };
    const data = { component: 0 };
    const context = generateProcessorContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
  });

  it('Validating a simple selectbox that is required and present in the data with value set to false will return a FieldError', async function () {
    const component: SelectBoxesComponent = {
      ...simpleSelectBoxes,
      validate: { required: true },
      values: [
        {
          label: 'true',
          value: 'true',
        },
        {
          label: 'false',
          value: 'false',
        },
      ],
    };
    const data = {
      component: {
        true: false,
        false: false,
      },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.be.instanceOf(FieldError);
  });

  it('Validating a simple checkbox that is required and present in the data with value set to false will return a FieldError', async function () {
    const component = { ...simpleCheckBoxField, validate: { required: true } };
    const data = { component: false };
    const context = generateProcessorContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.be.instanceOf(FieldError);
  });

  it('Should not return error message for empty Address 2 field in Address Component with manual mode', async function () {
    const component = { ...requiredAddressManualMode };
    const data = {
      component: {
        mode: 'manual',
        address: {
          address1: '2140 Worthington Drive',
          address2: '',
          city: 'Plano',
          country: 'US',
          state: 'Texas',
          zip: '75074',
        },
      },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateRequired(context);
    expect(result).to.equal(null);
  });
});
