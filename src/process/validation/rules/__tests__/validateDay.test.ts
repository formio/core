import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleDayField, simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateDay } from '../validateDay';

it('Validating a non-day component will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.equal(null);
});

it('Validating a day component with an invalid date string value will return a FieldError', async () => {
    const component = simpleDayField;
    const data = {
        component: 'hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDay');
});

it('Validating a day component with an valid date string value will return null', async () => {
    const component = simpleDayField;
    const data = {
        component: '03/23/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.equal(null);
});

it('Validating a day component with an invalid Date object will return a FieldError', async () => {
    const component = simpleDayField;
    const data = {
        component: new Date('Hello, world!'),
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDay');
});

it('Validating a day component with a valid Date object will return a field error', async () => {
    const component = simpleDayField;
    const data = {
        component: new Date(),
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDay');
});

it('Validating a day component with hidden day field with an valid date string value will return null', async () => {
    const component = simpleDayField;
    component.fields.day.hide = true;
    const data = {
        component: '03/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.equal(null);
});

it('Validating a day component with hidden day field with invalid date will return a field error', async () => {
    const component = simpleDayField;
    component.fields.day.hide = true;
    const data = {
        component: '13/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDay');
});

it('Validating a day component with hidden month field with an valid date string value will return null', async () => {
    const component = simpleDayField;
    component.fields.month.hide = true;
    const data = {
        component: '23/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.equal(null);
});

it('Validating a day component with hidden month field with invalid date will return a field error', async () => {
    const component = simpleDayField;
    component.fields.month.hide = true;
    const data = {
        component: '130/2023',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDay');
});

it('Validating a day component with hidden year field with an valid date string value will return null', async () => {
    const component = simpleDayField;
    component.fields.year.hide = true;
    const data = {
        component: '01/23',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.equal(null);
});

it('Validating a day component with hidden year field with invalid date will return a field error', async () => {
    const component = simpleDayField;
    component.fields.year.hide = true;
    const data = {
        component: '13/23',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateDay(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDay');
});

