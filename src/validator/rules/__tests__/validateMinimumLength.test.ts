import { expect } from 'chai';
import { FieldError } from 'error/FieldError';
import { simpleTextField } from './fixtures/components';
import { validateMinimumLength } from '../validateMinimumLength';

it('Validating a component without a minLength property will return null', async () => {
    const component = simpleTextField;
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMinimumLength(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a component with a minLength property and a length less than minLength will return a FieldError', async () => {
    const component = { ...simpleTextField, validate: { minLength: 4 } };
    const data = {
        component: 'foo',
    };
    const result = await validateMinimumLength(component, data, {});
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.message).to.contain('must have at least 4 characters');
});

it('Validating a component with a minLength property and a length equal to minLength will return null', async () => {
    const component = { ...simpleTextField, validate: { minLength: 4 } };
    const data = {
        component: 'fooo',
    };
    const result = await validateMinimumLength(component, data, {});
    expect(result).to.equal(null);;
});

it('Validating a component with a minLength property and a length greater than minLength will return null', async () => {
    const component = { ...simpleTextField, validate: { minLength: 4 } };
    const data = {
        component: 'Hello, world!',
    };
    const result = await validateMinimumLength(component, data, {});
    expect(result).to.equal(null);;
});
