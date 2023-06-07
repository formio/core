import { expect } from 'chai';
import { FieldError } from '../../../error/FieldError';
import { simpleNumberField, simpleTextField } from './fixtures/components';
import { validateMinimumValue } from '../validateMinimumValue';

it('Validating a component without the min property will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMinimumValue(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a number component without the min property will return null', async () => {
    const component = simpleNumberField;
    const data = {
        component: 3,
    };
    const result = await validateMinimumValue(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a number component that contains the min property will return null if the value is greater than the minimum', async () => {
    const component = { ...simpleNumberField, validate: { min: 50 } };
    const data = {
        component: 55,
    };
    const result = await validateMinimumValue(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a number component that contains the min property will return a FieldError if the value is less than the minimum', async () => {
    const component = { ...simpleNumberField, validate: { min: 50 } };
    const data = {
        component: 35,
    };
    const result = await validateMinimumValue(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.message).to.contain('cannot be less than');
});

it('Validating a number component that contains the min property will return null if the value is equal to the minimum', async () => {
    const component = { ...simpleNumberField, validate: { min: 50 } };
    const data = {
        component: 50,
    };
    const result = await validateMinimumValue(component, data, {});
    expect(result).to.equal(null);;
});
