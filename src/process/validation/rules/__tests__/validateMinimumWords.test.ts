import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateMinimumWords } from '../validateMinimumWords';

describe('validateMinimumWords', function () {
  it('Validating a component without the maxWords property will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumWords(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with the minWords property will return a FieldError if the number of words is less than the minimum', async function () {
    const component = { ...simpleTextField, validate: { minWords: 3 } };
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumWords(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('minWords');
  });

  it('Validating a component with the minWords property will return null if the number of words is equal to the minimum', async function () {
    const component = { ...simpleTextField, validate: { minWords: 3 } };
    const data = {
      component: 'Hello, world, again!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumWords(context);
    expect(result).to.equal(null);
  });

  it('Validating a component with the minWords property will return null if the number of words is greater than the minimum', async function () {
    const component = { ...simpleTextField, validate: { minWords: 3 } };
    const data = {
      component: 'Hello, world, it is I!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumWords(context);
    expect(result).to.equal(null);
  });
});
