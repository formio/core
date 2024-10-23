import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateMaximumWords } from '../validateMaximumWords';

describe('validateMaximumWords', function () {
  it('Validating a component without the maxWords property will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumWords(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with the maxWords property will return a FieldError if the number of words is greater than the maximum', async function () {
    const component = { ...simpleTextField, validate: { maxWords: 3 } };
    const data = {
      component: "Hello, world, it's me!",
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumWords(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('maxWords');
  });

  it('Validating a component with the maxWords property will return null if the number of words is equal to the maximum', async function () {
    const component = { ...simpleTextField, validate: { maxWords: 3 } };
    const data = {
      component: 'Hello, world, again!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumWords(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with the maxWords property will return null if the number of words is less than the maximum', async function () {
    const component = { ...simpleTextField, validate: { maxWords: 3 } };
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumWords(context);
    expect(result).to.equal(null);
  });
});
