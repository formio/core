import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateMaximumLength } from '../validateMaximumLength';

describe('validateMaximumLength', function () {
  it('Validating a component without a maxLength property will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumLength(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with a maxLength property and a length greater than maxLength will return a FieldError', async function () {
    const component = { ...simpleTextField, validate: { maxLength: 4 } };
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumLength(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('maxLength');
  });

  it('Validating a component with a maxLength property and a length less than maxLength will return null', async function () {
    const component = { ...simpleTextField, validate: { maxLength: 4 } };
    const data = {
      component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumLength(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with a maxLength property that is an empty string will return null', async function () {
    const component = { ...simpleTextField, validate: { maxLength: 4 } };
    const data = {
      component: '',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumLength(context);
    expect(result).to.equal(null);
  });
});
