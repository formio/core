import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleSelectBoxes, simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateMinimumSelectedCount } from '../validateMinimumSelectedCount';

describe('validateMinimumSelectedCount', function () {
  it('Validting a non-select boxes component will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumSelectedCount(context);
    expect(result).to.equal(null);
  });

  it('Validating a select boxes component without minSelectedCount will return null', async function () {
    const component = simpleSelectBoxes;
    const data = {
      component: {
        foo: true,
        bar: true,
        baz: false,
        biz: false,
      },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumSelectedCount(context);
    expect(result).to.equal(null);
  });

  it('Validating a select boxes component where the number of selected fields is less than minSelectedCount will return a FieldError', async function () {
    const component = { ...simpleSelectBoxes, validate: { minSelectedCount: 2 } };
    const data = {
      component: {
        foo: true,
        bar: false,
        baz: false,
        biz: false,
      },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumSelectedCount(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('minSelectedCount');
  });

  it('Validating a select boxes component where the number of selected fields is equal to minSelectedCount will return null', async function () {
    const component = { ...simpleSelectBoxes, validate: { minSelectedCount: 2 } };
    const data = {
      component: {
        foo: true,
        bar: true,
        baz: false,
        biz: false,
      },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumSelectedCount(context);
    expect(result).to.equal(null);
  });

  it('Validating a select boxes component where the number of selected fields is greater than minSelectedCount will return null', async function () {
    const component = { ...simpleSelectBoxes, validate: { minSelectedCount: 2 } };
    const data = {
      component: {
        foo: true,
        bar: true,
        baz: true,
        biz: false,
      },
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumSelectedCount(context);
    expect(result).to.equal(null);
  });
});
