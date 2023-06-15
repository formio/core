import { expect } from 'chai';

import { FieldError } from 'error';
import { calendarTextField, simpleDateTimeField, simpleTextField } from './fixtures/components';
import { validateDate } from '../validateDate';
import { generateProcessContext } from './fixtures/util';

it('Validating a component without a date/time concern will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
});

it('Validating a date/time component with no data will return null', async () => {
    const component = simpleDateTimeField;
    const data = {};
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
});

it('Validating a date/time component with an invalid date string value will return a FieldError', async () => {
    const component = simpleDateTimeField;
    const data = {
        component: 'hello, world!',
    };
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDate');
});

it('Validating a date/time component with an valid date string value will return null', async () => {
    const component = simpleDateTimeField;
    const data = {
        component: '2023-03-09T12:00:00-06:00',
    };
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
});

it('Validating a date/time component with an invalid Date object will return a FieldError', async () => {
    const component = simpleDateTimeField;
    const data = {
        component: new Date('Hello, world!'),
    };
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDate');
});

it('Validating a date/time component with a valid Date object will return null', async () => {
    const component = simpleDateTimeField;
    const data = {
        component: new Date(),
    };
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
});

it('Validating a textField calendar picker component with no data will return null', async () => {
    const component = calendarTextField;
    const data = {};
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
});

it('Validating a textField calendar picker component with an invalid date string value will return a FieldError', async () => {
    const component = calendarTextField;
    const data = {
        component: 'hello, world!',
    };
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDate');
});

it('Validating a textField calendar picker component with an valid date string value will return null', async () => {
    const component = calendarTextField;
    const data = {
        component: '2023-03-09T12:00:00-06:00',
    };
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
});

it('Validating a textField calendar picker component with an invalid Date object will return a FieldError', async () => {
    const component = calendarTextField;
    const data = {
        component: new Date('Hello, world!'),
    };
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDate');
});

it('Validating a textField calendar picker component with a valid Date object will return null', async () => {
    const component = calendarTextField;
    const data = {
        component: new Date(),
    };
    const context = generateProcessContext(component, data);
    const result = await validateDate(context);
    expect(result).to.equal(null);
});
