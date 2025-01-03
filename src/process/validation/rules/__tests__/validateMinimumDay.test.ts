import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleDayField, simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateMinimumDay } from '../validateMinimumDay';

describe('validateMinimumDay', function () {
  it('Validating a non-day component will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumDay(context);
    expect(result).to.equal(null);
  });

  it('Validating a day component with a day before the minimum day will return a FieldError', async function () {
    const component = { ...simpleDayField, minDate: '2023-04-01' };
    const data = {
      component: '03/23/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('minDate');
  });

  it('Validating a day component with a day after the minimum day will return null', async function () {
    const component = { ...simpleDayField, minDate: '2023-04-01' };
    const data = {
      component: '04/02/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumDay(context);
    expect(result).to.equal(null);
  });

  it('Validating a day-first day component with a day before the minimum day will return a FieldError', async function () {
    const component = { ...simpleDayField, dayFirst: true, minDate: '2023-04-01' };
    const data = {
      component: '02/02/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('minDate');
  });

  it('Validating a day-first day component with a day after the minimum day will return null', async function () {
    const component = { ...simpleDayField, dayFirst: true, minDate: '2023-04-01' };
    const data = {
      component: '23/04/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMinimumDay(context);
    expect(result).to.equal(null);
  });
});
