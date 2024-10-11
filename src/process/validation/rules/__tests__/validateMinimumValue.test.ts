import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleNumberField, simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateMinimumValue } from '../validateMinimumValue';

describe('validateMinimumValue', function () {
  it('Validating a component without the min property will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumValue(context);
    expect(result).to.equal(null);
  });

  it('Validating a number component without the min property will return null', async function () {
    const component = simpleNumberField;
    const data = {
      component: 3,
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumValue(context);
    expect(result).to.equal(null);
  });

  it('Validating a number component that contains the min property will return null if the value is greater than the minimum', async function () {
    const component = { ...simpleNumberField, validate: { min: 50 } };
    const data = {
      component: 55,
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumValue(context);
    expect(result).to.equal(null);
  });

  it('Validating a number component that contains the min property will return a FieldError if the value is less than the minimum', async function () {
    const component = { ...simpleNumberField, validate: { min: 50 } };
    const data = {
      component: 35,
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumValue(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('min');
  });

  it('Validating a number component that contains the min property will return null if the value is equal to the minimum', async function () {
    const component = { ...simpleNumberField, validate: { min: 50 } };
    const data = {
      component: 50,
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumValue(context);
    expect(result).to.equal(null);
  });
});
