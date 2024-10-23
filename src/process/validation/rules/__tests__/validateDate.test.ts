import { expect } from 'chai';

import { FieldError } from 'error';
import { calendarTextField, simpleDateTimeField, simpleTextField } from './fixtures/components';
import { validateDate } from '../validateDate';
import { generateProcessorContext } from './fixtures/util';

describe('validateDate', function () {
  it('Validating a component without a date/time concern will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
  });

  it('Validating a date/time component with no data will return null', async function () {
    const component = simpleDateTimeField;
    const data = {};
    const context = generateProcessorContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
  });

  it('Validating a date/time component with an invalid date string value will return a FieldError', async function () {
    const component = simpleDateTimeField;
    const data = {
      component: 'hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDate(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDate');
  });

  it('Validating a date/time component with an valid date string value will return null', async function () {
    const component = simpleDateTimeField;
    const data = {
      component: '2023-03-09T12:00:00-06:00',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
  });

  it('Validating a date/time component with an invalid Date object will return a FieldError', async function () {
    const component = simpleDateTimeField;
    const data = {
      component: new Date('Hello, world!'),
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDate(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDate');
  });

  it('Validating a date/time component with a valid Date object will return null', async function () {
    const component = simpleDateTimeField;
    const data = {
      component: new Date(),
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
  });

  it('Validating a textField calendar picker component with no data will return null', async function () {
    const component = calendarTextField;
    const data = {};
    const context = generateProcessorContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
  });

  it('Textfield calendar picker component date values should not be validated and return null', async function () {
    const component = calendarTextField;
    const data = {
      component: 'hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDate(context);
    expect(result).to.be.equal(null);
  });
});
