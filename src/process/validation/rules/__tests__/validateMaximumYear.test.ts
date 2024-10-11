import { expect } from 'chai';

import { DayComponent } from 'types';
import { FieldError } from 'error';
import { simpleDayField, simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateMaximumYear } from '../validateMaximumYear';

describe('validateMaximumYear', function () {
  it('Validating a component without the maxYear parameter will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumYear(context);
    expect(result).to.equal(null);
  });

  it('Validating a day component without the maxYear parameter will return null', async function () {
    const component = simpleDayField;
    const data = {
      component: '01/22/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumYear(context);
    expect(result).to.equal(null);
  });

  it('Validating a day component with the maxYear parameter will return a FieldError if the year is greater than the maximum', async function () {
    const component: DayComponent = {
      ...simpleDayField,
      fields: {
        ...simpleDayField.fields,
        year: { ...simpleDayField.fields.year, maxYear: '2022' },
      },
      maxYear: '2022',
    };
    const data = {
      component: '01/22/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumYear(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('maxYear');
  });

  it('Validating a day component with the maxYear parameter will return null if the year is equal to the maximum', async function () {
    const component: DayComponent = {
      ...simpleDayField,
      fields: {
        ...simpleDayField.fields,
        year: { ...simpleDayField.fields.year, maxYear: '2022' },
      },
      maxYear: '2022',
    };
    const data = {
      component: '01/22/2022',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumYear(context);
    expect(result).to.equal(null);
  });

  it('Validating a day component with the maxYear parameter will return null if the year is less than the maximum', async function () {
    const component: DayComponent = {
      ...simpleDayField,
      fields: {
        ...simpleDayField.fields,
        year: { ...simpleDayField.fields.year, maxYear: '2022' },
      },
      maxYear: '2022',
    };
    const data = {
      component: '01/22/2021',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateMaximumYear(context);
    expect(result).to.equal(null);
  });
});
