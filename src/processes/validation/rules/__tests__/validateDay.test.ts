import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleDayField, simpleTextField } from './fixtures/components';
import { validateDay } from '../validateDay';

it('Validating a non-day component will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateDay(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a day component with an invalid date string value will return a FieldError', async () => {
    const component = simpleDayField;
    const data = {
        component: 'hello, world!',
    };
    const result = await validateDay(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDay');
});

it('Validating a day component with an valid date string value will return null', async () => {
    const component = simpleDayField;
    const data = {
        component: '03/23/2023',
    };
    const result = await validateDay(component, data, {});
    expect(result).to.equal(null);
});

it('Validating a day component with an invalid Date object will return a FieldError', async () => {
    const component = simpleDayField;
    const data = {
        component: new Date('Hello, world!'),
    };
    const result = await validateDay(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDay');
});

it('Validating a day component with a valid Date object will return a field error', async () => {
    const component = simpleDayField;
    const data = {
        component: new Date(),
    };
    const result = await validateDay(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('invalidDay');
});
