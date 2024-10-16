import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateMinimumLength } from '../validateMinimumLength';

describe('validateMinimumLength', function () {
  it('Validating a component without a minLength property will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumLength(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with a minLength property and a length less than minLength will return a FieldError', async function () {
    const component = { ...simpleTextField, validate: { minLength: 4 } };
    const data = {
      component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumLength(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('minLength');
  });

  it('Validating a component with a minLength property and a length equal to minLength will return null', async function () {
    const component = { ...simpleTextField, validate: { minLength: 4 } };
    const data = {
      component: 'fooo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumLength(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with a minLength property and a length greater than minLength will return null', async function () {
    const component = { ...simpleTextField, validate: { minLength: 4 } };
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumLength(context);
    expect(result).to.equal(null);
  });
});
