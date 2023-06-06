import { FieldError } from '../../../error/FieldError';
import { calendarTextField, simpleDateTimeField, simpleDayField, simpleTextField } from 'test/fixtures/components';
import { validateDate } from '../validateDate';

test('Validating a component without a date/time concern will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateDate(component, data, {});
    expect(result).toBe(null);
});

test('Validating a date/time component with no data will return null', async () => {
    const component = simpleDateTimeField;
    const data = {};
    const result = await validateDate(component, data, {});
    expect(result).toBe(null);
});

test('Validating a date/time component with an invalid date string value will return a FieldError', async () => {
    const component = simpleDateTimeField;
    const data = {
        component: 'hello, world!',
    };
    const result = await validateDate(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toBe('Simple Date/Time is not a valid date');
});

test('Validating a date/time component with an valid date string value will return null', async () => {
    const component = simpleDateTimeField;
    const data = {
        component: '2023-03-09T12:00:00-06:00',
    };
    const result = await validateDate(component, data, {});
    expect(result).toBe(null);
});

test('Validating a date/time component with an invalid Date object will return a FieldError', async () => {
    const component = simpleDateTimeField;
    const data = {
        component: new Date('Hello, world!'),
    };
    const result = await validateDate(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toBe('Simple Date/Time is not a valid date');
});

test('Validating a date/time component with a valid Date object will return null', async () => {
    const component = simpleDateTimeField;
    const data = {
        component: new Date(),
    };
    const result = await validateDate(component, data, {});
    expect(result).toBe(null);
});

test('Validating a textField calendar picker component with no data will return null', async () => {
    const component = calendarTextField;
    const data = {};
    const result = await validateDate(component, data, {});
    expect(result).toBe(null);
});

test('Validating a textField calendar picker component with an invalid date string value will return a FieldError', async () => {
    const component = calendarTextField;
    const data = {
        component: 'hello, world!',
    };
    const result = await validateDate(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toBe('Text Field is not a valid date');
});

test('Validating a textField calendar picker component with an valid date string value will return null', async () => {
    const component = calendarTextField;
    const data = {
        component: '2023-03-09T12:00:00-06:00',
    };
    const result = await validateDate(component, data, {});
    expect(result).toBe(null);
});

test('Validating a textField calendar picker component with an invalid Date object will return a FieldError', async () => {
    const component = calendarTextField;
    const data = {
        component: new Date('Hello, world!'),
    };
    const result = await validateDate(component, data, {});
    expect(result).toBeInstanceOf(FieldError);
    expect(result?.message).toBe('Text Field is not a valid date');
});

test('Validating a textField calendar picker component with a valid Date object will return null', async () => {
    const component = calendarTextField;
    const data = {
        component: new Date(),
    };
    const result = await validateDate(component, data, {});
    expect(result).toBe(null);
});
