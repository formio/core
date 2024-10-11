import { expect } from 'chai';
import { FieldError } from 'error';
import { simpleDayField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateRequiredDay } from '../validateRequiredDay';

describe('validateRequiredDay', function () {
  it('Validating a day component without data will return a requiredDayEmpty FieldError', async function () {
    const component = {
      ...simpleDayField,
      fields: { day: { required: true }, month: { required: false }, year: { required: false } },
    };
    const data = {};
    const context = generateProcessorContext(component, data);
    const result = await validateRequiredDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('requiredDayEmpty');
  });

  it('Validating a day component that requires day will return a FieldError if day is not given', async function () {
    const component = {
      ...simpleDayField,
      fields: { day: { required: true } },
    };
    const data = { component: '01/00/2024' };
    const context = generateProcessorContext(component, data);
    const result = await validateRequiredDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('requiredDayField');
  });

  it('Validating a day component that requires month will return a FieldError if month is not given', async function () {
    const component = {
      ...simpleDayField,
      fields: { month: { required: true } },
    };
    const data = { component: '00/01/2024' };
    const context = generateProcessorContext(component, data);
    const result = await validateRequiredDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('requiredMonthField');
  });

  it('Validating a day component that requires year will return a FieldError if year is not given', async function () {
    const component = {
      ...simpleDayField,
      fields: { year: { required: true } },
    };
    const data = { component: '01/01/0000' };
    const context = generateProcessorContext(component, data);
    const result = await validateRequiredDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('requiredYearField');
  });
});
