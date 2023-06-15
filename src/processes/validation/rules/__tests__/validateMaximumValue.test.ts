import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleNumberField, simpleTextField } from './fixtures/components';
import { validateMaximumValue } from '../validateMaximumValue';
import { generateProcessContext } from './fixtures/util';

it('Validating a component without the max property will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const context = generateProcessContext(component, data);
    const result = await validateMaximumValue(context);
    expect(result).to.equal(null);
});

it('Validating a number component without the max property will return null', async () => {
    const component = simpleNumberField;
    const data = {
        component: 3,
    };
    const context = generateProcessContext(component, data);
    const result = await validateMaximumValue(context);
    expect(result).to.equal(null);
});

it('Validating a number component that contains the max property will return null if the value is less than the maximum', async () => {
    const component = { ...simpleNumberField, validate: { max: 50 } };
    const data = {
        component: 35,
    };
    const context = generateProcessContext(component, data);
    const result = await validateMaximumValue(context);
    expect(result).to.equal(null);
});

it('Validating a number component that contains the max property will return a FieldError if the value is greater than the maximum', async () => {
    const component = { ...simpleNumberField, validate: { max: 50 } };
    const data = {
        component: 55,
    };
    const context = generateProcessContext(component, data);
    const result = await validateMaximumValue(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.equal('maxValue');
});

it('Validating a number component that contains the max property will return null if the value is equal to the maximum', async () => {
    const component = { ...simpleNumberField, validate: { max: 50 } };
    const data = {
        component: 50,
    };
    const context = generateProcessContext(component, data);
    const result = await validateMaximumValue(context);
    expect(result).to.equal(null);
});
