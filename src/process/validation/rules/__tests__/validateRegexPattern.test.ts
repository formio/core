import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateRegexPattern } from '../validateRegexPattern';

describe('validateRegexPattern', function () {
  it('Validating a component without a pattern parameter will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateRegexPattern(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with a pattern parameter will return a FieldError if the value does not match the pattern', async function () {
    const component = { ...simpleTextField, validate: { pattern: '\\d*' } };
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateRegexPattern(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('pattern');
  });

  it('Validating a component with a pattern parameter will return null if the value matches the pattern', async function () {
    const component = { ...simpleTextField, validate: { pattern: '\\d*' } };
    const data = {
      component: '12345',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateRegexPattern(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with an empty value will not trigger the pattern validation', async function () {
    const component = { ...simpleTextField, validate: { pattern: '\\d' } };
    const data = {
      component: '',
    };

    const context = generateProcessorContext(component, data);
    const result = await validateRegexPattern(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with a pattern parameter and a pattern message will return a FieldError if the value does not match the pattern', async function () {
    const component = {
      ...simpleTextField,
      validate: { pattern: '\\d', patternMessage: 'Can only contain digits.' },
    };
    const data = {
      component: 'abc',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateRegexPattern(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result).to.have.property('errorKeyOrMessage', 'Can only contain digits.');
  });
});
